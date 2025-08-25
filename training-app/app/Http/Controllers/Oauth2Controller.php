<?php

namespace App\Http\Controllers;

use App\Http\Resources\customer\AuthResource;
use App\Repositories\Services\Oauth2Service;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

class Oauth2Controller extends Controller
{
    protected Oauth2Service $oauth2Service;

    /**
     * Oauth2Controller constructor.
     *
     * @param Oauth2Service $oauth2Service
     */
    public function __construct(Oauth2Service $oauth2Service){
        $this->oauth2Service = $oauth2Service;
    }

    /**
     * Redirect to Google OAuth 2.0 login page
     *
     * @return RedirectResponse|Redirector
     */
    public function redirectToGoogle()
    {
        return $this->oauth2Service->redirectToGoogle();
    }

    /**
     * Handle the callback from Google OAuth 2.0
     *
     * @return RedirectResponse|JsonResponse
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $token = $this->oauth2Service->handleGoogleCallback($request->ip());
            return redirect(config('app.frontend_url') . '/auth/google/token=' . $token);
        } catch (Exception $e) {
            return response()->json(['error' => 'Login failed'], 500);
        }
    }

    /**
     * Verify Google token
     *
     * @param Request $request
     * @return AuthResource | JsonResponse
     */
    public function verifyGoogleToken(Request $request)
    {
        try {
            $request->validate([
                'id_token' => 'required|string',
            ]);

            $token = $this->oauth2Service->verifyGoogleToken($request->id_token, $request->ip());
            $data = [
                'token' => $token,
            ];

            return new AuthResource($data, 'Đăng nhập bằng google thành công thành công');
        } catch (Exception $e) {
            return (new AuthResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
