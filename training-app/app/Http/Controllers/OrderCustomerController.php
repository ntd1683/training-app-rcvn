<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderSearchRequest;
use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Repositories\Services\OrderService;
use App\Repositories\Services\ProductService;
use Illuminate\Http\Request;

class OrderCustomerController extends Controller
{
    protected OrderService $orderService;

    /**
     * OrderCustomerController constructor.
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
            $orders = $this->orderService->getFilteredOrders($validated, $customer);

            return new OrderCollection($orders);
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function edit($id, Request $request)
    {
        try {
            $order = $this->orderService->getOrderById($id, $request->user());
            if (!$order) {
                return (new OrderResource(null))->errorResponse(
                    'NOT_FOUND',
                    null,
                    'Không tìm thấy đơn hàng'
                );
            }
            return new OrderResource($order, 'Lấy thông tin đơn hàng thành công');
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
