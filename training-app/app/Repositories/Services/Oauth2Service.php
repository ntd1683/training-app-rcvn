<?php

namespace App\Repositories\Services;

use App\Models\Customer;
use App\Repositories\CustomerRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

/**
 * Class Oauth2Service
 * Handles business logic for oauth 2.0
 */
class Oauth2Service
{
    protected CustomerRepository $customerRepository;

    /**
     * Oauth2Service constructor.
     *
     * @param CustomerRepository $customerRepository
     */
    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * Redirect to Google OAuth 2.0 login page
     *
     * @return RedirectResponse|Redirector
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle the callback from Google OAuth 2.0
     *
     * @return string $ip
     * @throws Exception
     */
    public function handleGoogleCallback($ip)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $customer = $this->customerRepository->findByProviderId($googleUser->id);

            if (!$customer) {
                $data = [
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'provider_id' => $googleUser->id,
                    'password' => bcrypt(Str::random(8)),
                    'last_login_ip' => $ip,
                    'last_login_at' => now(),
                ];
                $customer = $this->customerRepository->create($data);
            }

            Auth::login($customer);
            return $customer->createToken('authToken')->plainTextToken;
        } catch (Exception $e) {
            throw new Exception('Login failed: ' . $e->getMessage());
        }
    }

    /**
     * Verify Google token
     *
     * @param string $token
     * @return mixed
     * @throws Exception
     */
    public function verifyGoogleToken(string $token, string $ip)
    {
        try {
            $googleUser = Socialite::driver('google')->userFromToken($token);
            $customer = $this->customerRepository->findByProviderId($googleUser->id);

            if (!$customer) {
                $data = [
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'provider_id' => $googleUser->id,
                    'password' => bcrypt(Str::random(8)),
                    'email_verified_at' => now(),
                    'last_login_ip' => $ip,
                    'last_login_at' => now(),
                ];
                $customer = $this->customerRepository->create($data);
            }

            Auth::login($customer);
            return $customer->createToken('authToken')->plainTextToken;
        } catch (Exception $e) {
            throw new Exception('Login failed: ' . $e->getMessage());
        }
    }
}
