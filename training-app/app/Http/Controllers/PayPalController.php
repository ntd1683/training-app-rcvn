<?php

namespace App\Http\Controllers;

use App\Http\Requests\PayCallbackRequest;
use App\Http\Requests\PaypalCaptureRequest;
use App\Http\Requests\PaypalCreateRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PaypalResource;
use App\Repositories\Services\PaypalService;

/**
 * Class PayPalController
 * Handles HTTP requests for PayPal operations.
 */
class PayPalController extends Controller
{
    protected PaypalService $paypalService;

    /**
     * PayPalController constructor.
     *
     * @param PaypalService $paypalService
     */
    public function __construct(PaypalService $paypalService)
    {
        $this->paypalService = $paypalService;
    }

    public function createOrder(PaypalCreateRequest $request)
    {
        try {
            $validated = $request->validated();
            $currentUser = $request->user();
            $order = $this->paypalService->createOrder($validated, $currentUser);
            return new PaypalResource($order, null, 'CREATED');
        } catch (\Exception $e) {
            return (new PaypalResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function captureOrder(PaypalCaptureRequest $request)
    {
        try {
            $validated = $request->validated();
            $order = $this->paypalService->captureOrder($validated['order_id']);
            return new PaypalResource($order, null, 'OK');
        } catch (\Exception $e) {
            return (new PaypalResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function repay(PayCallbackRequest $request)
    {
        try {
            $validated = $request->validated();
            $order_id = $validated['order_id'];
            $currentUser = $request->user();
            $order = $this->paypalService->repay($order_id, $currentUser);
            return new PaypalResource($order, null, 'OK');
        } catch (\Exception $e) {
            \Log::info('Error in PayPalController@repay: ' . $e->getMessage());
            \Log::error($e->getCode());
            return (new PaypalResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function cancelOrder(PaypalCaptureRequest $request)
    {
        try {
            $validated = $request->validated();
            $this->paypalService->cancelOrder($validated['order_id']);
            return new OrderResource(null, 'OK');
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
