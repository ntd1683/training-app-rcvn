<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderSearchRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
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

    public function analytics(Request $request)
    {
        try {
            $data = $this->orderService->getOrderAnalytics();

            return new OrderResource($data, 'Thống kê đơn hàng thành công');
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function index(OrderSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $user = auth()->user();
            $orders = $this->orderService->getFilteredOrders($validated, $user, false);

            return new OrderCollection($orders);
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
