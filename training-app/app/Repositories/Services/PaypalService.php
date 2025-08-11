<?php

namespace App\Repositories\Services;

use App\Enums\OrderStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\PaymentTransactionRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Exception;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use Throwable;

/**
 * Class Product Service
 * Handles business logic for Product operations.
 */
class PaypalService
{
    protected OrderRepository $orderRepository;
    protected PaymentRepository $paymentRepository;
    protected PaymentTransactionRepository $paymentTransactionRepository;
    protected OrderService $orderService;
    private $client;

    /**
     * Order constructor.
     *
     * @param OrderRepository $orderRepository
     * @param OrderService    $orderService
     */
    public function __construct(
        OrderRepository $orderRepository,
        OrderService $orderService,
        PaymentRepository $paymentRepository,
        PaymentTransactionRepository $paymentTransactionRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->orderService = $orderService;
        $this->paymentRepository = $paymentRepository;
        $this->paymentTransactionRepository = $paymentTransactionRepository;

        $environment = new SandboxEnvironment(
            config('paypal.sandbox.client_id'),
            config('paypal.sandbox.client_secret')
        );
        $this->client = new PayPalHttpClient($environment);
    }

    /**
     * Create a new order
     *
     * @param array $data
     * @param $currentUser
     */
    public function createOrder(array $data, $currentUser)
    {

        $order = $this->orderService->createOrder($data, $currentUser);

        if (!$order) {
            throw new Exception('Không thể tạo đơn hàng', 500);
        }

        if ($order->total_amount <= 0) {
            throw new Exception('Số tiền đơn hàng phải lớn hơn 0', 404);
        }

        $request = new OrdersCreateRequest();
        $request->prefer('return=representation');
        $request->body = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => config('paypal.currency'),
                        'value' => $order->total_amount,
                    ],
                    'description' => "Order #{$order->order_code}",
                ],
            ],
            'application_context' => [
                'shipping_preference' => 'NO_SHIPPING',
                'brand_name' => config('app.name'),
            ],
        ];

        try {
            $response = $this->client->execute($request);
            $order->update(
                [
                'paypal_order_id' => $response->result->id,
                'status' => OrderStatusEnum::PROCESSING->value,
                ]
            );
            \Log::info(
                'PayPal order created successfully', [
                'id' => $response->result->id,
                'status' => $response->result->status,
                'user_id' => $currentUser->id,
                'order_id' => $order->id,
                'full_response' => json_encode($response->result),
                ]
            );
            return [
                'id' => $response->result->id,
                'status' => $response->result->status,
                'order_id' => $order->id,
            ];
        } catch (\Exception $e) {
            \Log::error('PayPal create order error', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * capture order
     *
     * @param  int $id
     * @return Model
     * @throws Throwable
     */
    public function captureOrder($id)
    {
        $order = $this->orderRepository->findByField('paypal_order_id', $id)->first();
        if (!$order) {
            throw new Exception('Không tìm thấy đơn hàng', 404);
        }

        if ($order->deleted_at) {
            throw new Exception('Đơn hàng đã bị xóa', 404);
        }

        $request = new OrdersCaptureRequest($order->paypal_order_id);
        $request->prefer('return=representation');

        try {
            $customerId = $order->customer_id;
            $orderId = $order->id;

            $response = $this->client->execute($request);
            $status = $response->result->status;
            $transactionData = [
                'transaction_id' => $response->result->id,
                'payer_id' => $response->result->payer->payer_id ?? 'unknown',
                'order_id' => $orderId,
                'payment_id' => null,
                'amount' => $response->result->purchase_units[0]->amount->value ?? $order->total_amount,
                'currency' => $response->result->purchase_units[0]->amount->currency_code ?? config('paypal.currency'),
                'payment_status' => $status === 'COMPLETED' ? PaymentStatusEnum::COMPLETED : PaymentStatusEnum::FAILED,
                'payment_method' => 'paypal',
                'payment_time' => now(),
                'response_data' => json_encode($response->result),
            ];
            $paymentMethodToken = $response->result->payment_source->paypal->vault_id ?? null;
            if ($paymentMethodToken) {
                $payment = $this->paymentRepository->firstOrCreate(
                    [
                        'customer_id' => $customerId,
                        'payment_method_token' => $paymentMethodToken,
                    ],
                    [
                        'payment_method_type' => 'paypal',
                        'status' => 'active',
                        'is_default' => false,
                    ]
                );
                $transactionData['payment_id'] = $payment->id;
            }

            $transaction = $this->paymentTransactionRepository->create($transactionData);

            if ($response->result->status === 'COMPLETED') {
                $order->update(['status' => OrderStatusEnum::COMPLETED->value]);
                $orderDetails = $order->orderDetails()->with('product')->get();
                foreach ($orderDetails as $orderDetail) {
                    if ($orderDetail->product) {
                        $currentQuantity = $orderDetail->product->quantity;
                        if ($currentQuantity >= $orderDetail->quantity) {
                            $orderDetail->product->decrement('quantity', $orderDetail->quantity);
                        } else {
                            throw new Exception("Sản phẩm {$orderDetail->product->name} không đủ số lượng tồn kho");
                        }
                    }
                }

                return $transaction;
            }
            $order->update(['status' => OrderStatusEnum::PAYMENT_FAILED->value]);
            throw new Exception('Payment not completed', 400);
        } catch (\Exception $e) {
            $order->update(['status' => OrderStatusEnum::PAYMENT_FAILED->value]);
            Log::info('Error updating order: ' . $e->getMessage());
            throw $e;
        }
    }
}
