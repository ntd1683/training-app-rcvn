<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\LoginRequest;
use App\Http\Resources\AuthResource;
use App\Repositories\Services\Admin\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class AuthController
 * Handles authentication-related HTTP requests.
 */
class AuthController extends Controller
{
    protected $authService;

    /**
     * AuthController constructor.
     *
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle user login
     *
     * @param  LoginRequest $request
     * @return AuthResource|\Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->only('email', 'password'),
                $request->input('remember', false),
                $request->ip()
            );
            return new AuthResource($result, 'Đăng nhập thành công thành công');
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Get the authenticated user's profile
     *
     * @param  Request $request
     * @return AuthResource|\Illuminate\Http\JsonResponse
     */
    public function profile(Request $request)
    {
        try {
            $user = $this->authService->getProfile($request->user());
            return new AuthResource($user, 'Lấy thông tin người dùng thành công');
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Verify the user's token
     *
     * @param  Request $request
     * @return AuthResource|JsonResponse
     */
    public function verifyToken(Request $request)
    {
        try {
            $result = $this->authService->verifyToken($request->user());
            if (!$result['success']) {
                return (new AuthResource(null))->errorResponse(
                    'UNAUTHORIZED',
                    null,
                    $result['message']
                );
            }
            return new AuthResource($result['data'], $result['message']);
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Log the user out
     *
     * @param  Request $request
     * @return AuthResource|JsonResponse
     */
    public function logout(Request $request)
    {
        try {
            $result = $this->authService->logout($request->user());
            if (!$result['success']) {
                return (new AuthResource(null))->errorResponse(
                    'UNAUTHORIZED',
                    null,
                    $result['message']
                );
            }

            \Log::info(
                'User logged out',
                ['user_id' => $request->user()->id, 'ip' => $request->ip()]
            );
            return new AuthResource(null, $result['message']);
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
