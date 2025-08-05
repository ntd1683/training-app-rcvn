<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnalyticsResource;
use App\Repositories\Services\ProductService;
use App\Repositories\Services\UserService;
use Illuminate\Http\Request;

class AnalyticController extends Controller
{
    protected UserService $userService;
    protected ProductService $productService;

    /**
     * UserController constructor.
     *
     * @param UserService    $userService
     * @param ProductService $productService
     */
    public function __construct(UserService $userService, ProductService $productService)
    {
        $this->userService = $userService;
        $this->productService = $productService;
    }

    public function analytic(Request $request)
    {
        $users = $this->userService->getAllUsers()->count();
        $products = $this->productService->getAllProducts()->count();
        $data = [
            'total_users' => $users,
            'total_products' => $products,
        ];
        return new AnalyticsResource($data, null, 'CREATED');
    }
}
