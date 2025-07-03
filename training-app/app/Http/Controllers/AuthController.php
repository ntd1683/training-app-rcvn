<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Carbon\Carbon;
use Str;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->input('remember', false);

        $user = User::where('email', $credentials['email'])
                            ->where('is_delete', false)
                            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'The provided email does not exist or has been deleted.',
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
            'message' => 'Invalid credentials',
        ], 401);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
            Auth::logout();
            return response()->json(['success' => true, 'message' => 'Logged out successfully'])
                ->withCookie(cookie()->forget('XSRF-TOKEN'))
                ->withCookie(cookie()->forget('laravel_session'));
        }

        return response()->json(['success' => false, 'message' => 'No authenticated user'], 401);
    }
}
