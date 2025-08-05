<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class AuthController
 * Handles authentication-related HTTP requests.
 */
class LogoutController extends Controller
{
    /**
     * Log out
     *
     * @param  Request $request
     * @return AuthResource|JsonResponse
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        try {
            if ($user) {
                $user->currentAccessToken()->delete();
                return new AuthResource(null, "Đăng xuất thành công");
            } else {
                return (new AuthResource(null))->errorResponse(
                    'UNAUTHORIZED',
                    null,
                    "Bạn không có quyền truy cập hoặc đã đăng xuất trước đó"
                );
            }
        } catch (\Exception $e) {
            return (new AuthResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
