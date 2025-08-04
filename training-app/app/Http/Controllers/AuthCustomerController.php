<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\LoginRequest;
use App\Http\Requests\Customer\RegisterRequest;
use App\Http\Resources\AuthResource;
use App\Models\Customer;
use App\Repositories\Services\Customer\AuthService;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class AuthController
 * Handles authentication-related HTTP requests.
 */
class AuthCustomerController extends Controller
{
    protected $authService;

    /**
     * AuthController constructor.
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle customer login
     * @param LoginRequest $request
     * @return AuthResource|JsonResponse
     */
    public function login(LoginRequest $request)
    {
        try {
            $result = $this->authService->login(
                $request->only('email', 'password'),
                $request->input('remember', false),
                $request->ip(),
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
     * Handle customer registration
     * @param RegisterRequest $request
     * @return AuthResource|JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        try {
            $result = $this->authService->register(
                $request->only('name', 'email', 'password', 're_password'),
            );
            return new AuthResource($result, 'Đăng ký thành công');
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Verify the user's email address
     * @param Request $request
     * @return AuthResource|JsonResponse
     */
    public function verify(Request $request)
    {
        try {
            $token = $request->input('token');
            $result = $this->authService->verifyEmail($token);

            return new AuthResource($result, 'Email đã được xác thực thành công!');
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Resend the verification email to the user
     * @param Request $request
     * @return AuthResource|JsonResponse
     */
    public function resend(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|exists:customers,email',
            ]);
            $email = $validated['email'];
            if (!$email) {
                return (new AuthResource(null))->errorResponse(
                    'BAD_REQUEST',
                    null,
                    'Email không được để trống'
                );
            }

            $this->authService->resendVerificationToken($email);
            return new AuthResource(null, 'Email xác thực đã được gửi lại thành công!');
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
     * @param Request $request
     * @return AuthResource|JsonResponse
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
     * @param Request $request
     * @return AuthResource|JsonResponse
     */
    public function verifyToken(Request $request)
    {
        try {
            \Log::info('Verifying customer token', ['token' => $request->bearerToken()]);
            \Log::info('Request', ['request' => $request->all()]);
            $customer = $request->user();
            \Log::info('Customer token verification', ['customer_id' => $customer->id ?? null]);
            if ($customer === null) {
                return (new AuthResource(null))->errorResponse(
                    'UNAUTHORIZED',
                    null,
                    'Token không hợp lệ hoặc đã hết hạn'
                );
            }
            return new AuthResource($customer, 'Token hợp lệ');
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
