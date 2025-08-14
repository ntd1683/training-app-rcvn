<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderSearchRequest;
use App\Repositories\Services\OrderService;
use App\Repositories\Services\ProductService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected OrderService $orderService;

    /**
     * OrderController constructor.
     *
     * @param OrderService $orderService
     */
    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(OrderSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $customer = $request->user();
            $products = $this->orderService->getFilteredOrders($validated, $customer);

            return new ProductCollection($products, 'Lấy danh sách sản phẩm thành công');
        } catch (\Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
