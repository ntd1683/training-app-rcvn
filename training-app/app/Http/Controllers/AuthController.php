<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->input('remember', false);

        $user = User::where('email', $credentials['email'])
                            ->where('is_delete', false)
                            ->where('is_active', true)
                            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email không tồn tại hoặc tài khoản đã bị xóa hoặc không hoạt động',
            ], 401);
        }

        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;

            $user->update([
                'last_login_at' => Carbon::now(),
                'last_login_ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'user' => $user->only(['id', 'name', 'email', 'group_role', 'last_login_at']),
                'token' => $token,
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email hoặc mật khẩu không chính xác',
        ], 401);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đăng xuất thành công'
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Bạn chưa đăng nhập hoặc token không hợp lệ',
        ], 401);
    }
}
