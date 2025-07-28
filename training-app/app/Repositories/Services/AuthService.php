<?php

namespace App\Repositories\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Exception;

/**
 * Class AuthService
 * Handles authentication-related business logic.
 */
class AuthService
{
    protected $userRepository;

    /**
     * AuthService constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Handle user login
     * @param array $credentials
     * @param bool $remember
     * @param string $ip
     * @return array
     * @throws Exception
     */
    public function login(array $credentials, bool $remember, string $ip, string $clientPath = '')
    {
        $fromAdmin = $clientPath === 'admin';
        \Log::info('User login attempt', [
            'clientPath' => $clientPath,
            'from_admin' => $fromAdmin,
        ]);
        $user = $this->userRepository->findByEmail($credentials['email']);
        if (!$user || $user->is_delete || !$user->is_active) {
            throw new Exception('Email không tồn tại hoặc tài khoản đã bị xóa hoặc không hoạt động');
        }

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();
            if ($fromAdmin && $user->hasRole('User')) {
                throw new Exception('Bạn không có quyền truy cập vào trang quản trị');
            }
            $token = $user->createToken('authToken')->plainTextToken;

            $this->userRepository->update([
                'last_login_at' => Carbon::now(),
                'last_login_ip' => $ip,
            ], $user->id);

            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            $user->permissions = $permissions;

            \Log::info('User logged in', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $ip,
            ]);

            return array_merge(
                $user->only(['id', 'name', 'email', 'group_role', 'last_login_at', 'is_active']),
                ['permissions' => $permissions, 'token' => $token]
            );
        }

        throw new Exception('Thông tin đăng nhập không chính xác');
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
     * Verify the user's token
     * @param User|null $user
     * @return array
     */
    public function verifyToken($user)
    {
        if ($user) {
            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            $user->permissions = $permissions;
            return [
                'success' => true,
                'message' => 'Token hợp lệ',
                'data' => $user->only(['id', 'name', 'email', 'group_role', 'permissions']),
            ];
        }

        return [
            'success' => false,
            'message' => 'Token không hợp lệ hoặc đã hết hạn',
        ];
    }

    /**
     * Log the user out
     * @param User|null $user
     * @return array
     */
    public function logout($user)
    {
        if ($user) {
            $user->currentAccessToken()->delete();
            return [
                'success' => true,
                'message' => 'Đăng xuất thành công',
            ];
        }

        \Log::info('User logout attempt with invalid token', [
            'user_id' => $user?->id,
        ]);
        return [
            'success' => false,
            'message' => 'Bạn chưa đăng nhập hoặc token không hợp lệ',
        ];
    }
}
