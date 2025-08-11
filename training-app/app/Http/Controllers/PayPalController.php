<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaypalCaptureRequest;
use App\Http\Requests\PaypalCreateRequest;
use App\Http\Resources\OrderResource;
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
            return new OrderResource($order, null, 'CREATED');
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                'SERVER_ERROR',
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
            return new OrderResource($order, null, 'OK');
        } catch (\Exception $e) {
            return (new OrderResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
