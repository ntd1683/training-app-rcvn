<?php

namespace App\Http\Controllers;

use App\Http\Requests\Customer\LoginRequest;
use App\Http\Requests\Customer\RegisterRequest;
use App\Http\Requests\Customer\ResetPasswordRequest;
use App\Http\Requests\Customer\SendResetLinkEmailRequest;
use App\Http\Requests\Customer\UpdateProfileRequest;
use App\Http\Requests\Customer\VerifyEmailRequest;
use App\Http\Resources\customer\AuthResource;
use App\Repositories\Services\Customer\AuthService;
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
     *
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle customer login
     *
     * @param  LoginRequest $request
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
     *
     * @param  RegisterRequest $request
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
     *
     * @param  VerifyEmailRequest $request
     * @return AuthResource|JsonResponse
     */
    public function verifyEmail(VerifyEmailRequest $request)
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
     *
     * @param  Request $request
     * @return AuthResource|JsonResponse
     */
    public function resendEmail(Request $request)
    {
        try {
            $customer = $request->user();
            $email = $customer->email;
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
     * Send a password reset link to the user's email
     *
     * @param  SendResetLinkEmailRequest $request
     * @return AuthResource|JsonResponse
     */
    public function sendResetLinkEmail(SendResetLinkEmailRequest $request)
    {
        try {
            $email = $request->input('email');
            if (!$email) {
                return (new AuthResource(null))->errorResponse(
                    'BAD_REQUEST',
                    null,
                    'Email không được để trống'
                );
            }

            $this->authService->sendResetLinkEmail($email);
            return new AuthResource(
                null,
                'Vui lòng kiểm tra email để khôi phục lại mật khẩu.'
            );
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Reset the user's password
     *
     * @param  ResetPasswordRequest $request
     * @return AuthResource|JsonResponse
     */
    public function reset(ResetPasswordRequest $request)
    {
        $data = $request->only('email', 'password', 'password_confirmation', 'token');
        try {
            $result = $this->authService->resetPassword($data);
            return new AuthResource($result, 'Đặt lại mật khẩu thành công');
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    /**
     * Update the authenticated user's profile
     *
     * @param  UpdateProfileRequest $request
     * @return AuthResource|JsonResponse
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        try {
            $user = $this->authService->updateProfile($request->user(), $request->all());
            return new AuthResource($user, 'Cập nhật thông tin người dùng thành công');
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
            $customer = $request->user();
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
