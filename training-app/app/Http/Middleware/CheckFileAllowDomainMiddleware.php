<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckFileAllowDomainMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request                                                                          $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function handle(Request $request, Closure $next)
    {
        $allowedUrls = config('filesystems.allowed_domains', '');

        $allowedDomains = [];
        foreach ($allowedUrls as $url) {
            $url = trim($url);
            if (!empty($url)) {
                $parsedUrl = parse_url($url);
                if (isset($parsedUrl['host'])) {
                    $allowedDomains[] = $parsedUrl['host'];
                    if (isset($parsedUrl['port'])) {
                        $allowedDomains[] = $parsedUrl['host'] . ':' . $parsedUrl['port'];
                    }
                }
            }
        }

        $host = $request->getHost();
        $hostWithPort = $request->getHost() . ':' . $request->getPort();

        if (!in_array($host, $allowedDomains) && !in_array($hostWithPort, $allowedDomains)) {
            throw new \Exception('Domain not allowed: ' . $host);
        }

        return $next($request);
    }
}
