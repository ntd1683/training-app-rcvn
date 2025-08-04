<?php

namespace App\Repositories\Services\Customer;

use App\Models\Customer;
use App\Models\User;
use App\Repositories\CustomerRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * Class AuthService
 * Handles authentication-related business logic.
 */
class AuthService
{
    protected $customerRepository;

    /**
     * AuthService constructor.
     * @param CustomerRepository $customerRepository
     */
    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * Handle user login
     * @param array $credentials
     * @param bool $remember
     * @param string $ip
     * @return array
     * @throws Exception
     */
    public function login(array $credentials, bool $remember, string $ip)
    {
        $customer = $this->customerRepository->findByEmail($credentials['email']);
        if (!$customer) {
            throw new Exception('Email không tồn tại hoặc tài khoản đã bị xóa hoặc không hoạt động');
        }

        if (!Hash::check($credentials['password'], $customer->password)) {
            throw new Exception('Thông tin đăng nhập không chính xác');
        }

        $token = $remember
            ? $customer->createToken('authToken')->plainTextToken
            : $customer->createToken('authToken', ['*'], now()->addMonth())->plainTextToken;

        $this->customerRepository->update([
            'last_login_at' => Carbon::now(),
            'last_login_ip' => $ip,
        ], $customer->id);

        $permissions = $customer->getAllPermissions()->pluck('name')->toArray();
        $customer->permissions = $permissions;

        \Log::info('User logged in', [
            'customer_id' => $customer->id,
            'email' => $customer->email,
            'ip' => $ip,
        ]);

        return array_merge(
            $customer->only(['id', 'name', 'email', 'last_login_at']),
            ['permissions' => $permissions, 'token' => $token]
        );
    }

    /**
     * Handle customer registration
     * @param array $data
     * @return Customer
     * @throws Exception
     */
    public function register(array $data)
    {
        $data['password'] = bcrypt($data['password']);

        $existEmail = $this->customerRepository->findByEmail($data['email']);
        if ($existEmail) {
            throw new Exception('Email đã được sử dụng. Vui lòng chọn email khác.');
        }

        // Create the customer
        $customer = $this->customerRepository->create($data);

        $customer->sendEmailVerificationNotification();

        \Log::info('New customer registered', [
            'customer_id' => $customer->id,
            'email' => $customer->email,
        ]);

        return $customer;
    }

    /**
     * Verify the user's email address
     * @param string $token
     * @return Customer |null
     */
    public function verifyEmail(string $token)
    {
        if (!$token) {
            throw new Exception('Token không hợp lệ.');
        }

        $data = json_decode(base64_decode($token), true);

        if (!$data || !isset($data['id'], $data['hash'], $data['expires'])) {
            throw new Exception('Token không hợp lệ.');
        }

        // Check expiration
        if (time() > $data['expires']) {
            throw new Exception('Token đã hết hạn.');
        }

        $customer = Customer::findOrFail($data['id']);

        if (!hash_equals((string)$data['hash'], sha1($customer->getEmailForVerification()))) {
            throw new Exception('Token không hợp lệ.');
        }

        if ($customer->hasVerifiedEmail()) {
            throw new Exception('Email đã được xác thực trước đó.');
        }

        if ($customer->markEmailAsVerified()) {
            event(new Verified($customer));
        }

        return $customer;
    }

    /**
     * Resend the email verification token
     * @param string $email
     * @return bool
     * @throws Exception
     */

    public function resendVerificationToken(string $email)
    {
        $customer = $this->customerRepository->findByEmail($email);
        if (!$customer) {
            throw new Exception('Email không tồn tại.');
        }

        if ($customer->hasVerifiedEmail()) {
            throw new Exception('Email đã được xác thực trước đó.');
        }
        $customer->sendEmailVerificationNotification();
        return true;
    }

    /**
     * Get the authenticated user's profile
     * @param User $user
     * @return array
     */
    public function getProfile($user)
    {
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();
        $user->permissions = $permissions;
        return $user->only('id', 'name', 'email', 'is_active', 'permissions');
    }

    /**
     * Log the customer out
     * @param Customer|null $customer
     * @return array
     */
    public function logout($customer)
    {
        if ($customer) {
            $customer->currentAccessToken()->delete();
            return [
                'success' => true,
                'message' => 'Đăng xuất thành công',
            ];
        }

        \Log::info('Customer logout attempt with invalid token', [
            'customer_id' => $customer?->id,
        ]);
        return [
            'success' => false,
            'message' => 'Bạn chưa đăng nhập hoặc token không hợp lệ',
        ];
    }
}
