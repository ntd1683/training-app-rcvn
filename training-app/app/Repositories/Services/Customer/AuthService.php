<?php

namespace App\Repositories\Services\Customer;

use App\Models\Customer;
use App\Models\User;
use App\Repositories\CustomerRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

/**
 * Class AuthService
 * Handles authentication-related business logic.
 */
class AuthService
{
    protected $customerRepository;

    /**
     * AuthService constructor.
     *
     * @param CustomerRepository $customerRepository
     */
    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * Handle user login
     *
     * @param  array  $credentials
     * @param  bool   $remember
     * @param  string $ip
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

        $this->customerRepository->update(
            [
            'last_login_at' => Carbon::now(),
            'last_login_ip' => $ip,
            ], $customer->id
        );

        \Log::info(
            'User logged in', [
            'customer_id' => $customer->id,
            'email' => $customer->email,
            'ip' => $ip,
            ]
        );

        $arr_customer = $customer->toArray();
        $arr_customer['total_products'] = $customer->total_products;
        $arr_customer['total_price'] = $customer->total_price;

        return array_merge(
            $arr_customer,
            ['token' => $token]
        );
    }

    /**
     * Handle customer registration
     *
     * @param  array $data
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

        \Log::info(
            'New customer registered', [
            'customer_id' => $customer->id,
            'email' => $customer->email,
            ]
        );

        return $customer;
    }

    /**
     * Verify the user's email address
     *
     * @param  string $token
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
     *
     * @param  string $email
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
     * Send a password reset link to the user's email
     *
     * @param  string $email
     * @return bool
     * @throws Exception
     */
    public function sendResetLinkEmail(string $email)
    {
        \Log::info(
            'Password reset link requested', [
            'email' => $email,
            ]
        );
        if (!$email) {
            throw new Exception('Email không được để trống');
        }
        $status = Password::broker('customers')->sendResetLink(['email' => $email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new Exception(__($status));
        }

        return true;
    }

    /**
     * Reset the user's password
     *
     * @param  array $data
     * @return bool
     * @throws Exception
     */
    public function resetPassword(array $data)
    {
        $status = Password::broker('customers')->reset(
            $data,
            function ($customer, $password) {
                $customer->password = bcrypt($password);
                $customer->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new Exception(__($status));
        }

        return true;
    }

    /**
     * Update the authenticated customer's profile
     *
     * @param  Customer $customer
     * @param  array    $data
     * @return Customer
     * @throws Exception
     */
    public function updateProfile($customer, array $data)
    {
        $customer->fill($data);
        if (isset($data['password']) && isset($data['new_password'])) {
            if (!\Hash::check($data['password'], $customer->password)) {
                throw new \Exception('Mật khẩu hiện tại không đúng');
            }
            $customer->password = bcrypt($data['new_password']);
        }
        $customer->save();

        \Log::info(
            'Customer profile updated', [
            'customer' => $customer->id,
            'email' => $customer->email,
            ]
        );

        return $customer;
    }

    /**
     * Log the customer out
     *
     * @param  Customer|null $customer
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

        \Log::info(
            'Customer logout attempt with invalid token', [
            'customer_id' => $customer?->id,
            ]
        );
        return [
            'success' => false,
            'message' => 'Bạn chưa đăng nhập hoặc token không hợp lệ',
        ];
    }
}
