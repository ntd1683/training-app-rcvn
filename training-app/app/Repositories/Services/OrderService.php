<?php

namespace App\Repositories\Services;

use App\Enums\OrderStatusEnum;
use App\Enums\OrderTimelineStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\ProductStatusEnum;
use App\Repositories\Criteria\OrderFilterCriteria;
use App\Repositories\OrderDetailRepository;
use App\Repositories\OrderRepository;
use App\Repositories\OrderTimelineRepository;
use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Str;
use Throwable;

/**
 * Class Order Service
 * Handles business logic for Product operations.
 */
class OrderService
{
    protected OrderRepository $orderRepository;
    protected ProductRepository $productRepository;
    protected OrderDetailRepository $orderDetailRepository;
    protected OrderTimelineRepository $orderTimelineRepository;

    /**
     * Order Service constructor.
     *
     * @param OrderRepository $orderRepository
     * @param ProductRepository $productRepository
     * @param OrderDetailRepository $orderDetailRepository
     * @param OrderTimelineRepository $orderTimelineRepository
     * @
     */
    public function __construct(
        OrderRepository       $orderRepository,
        ProductRepository     $productRepository,
        OrderDetailRepository $orderDetailRepository,
        OrderTimelineRepository $orderTimelineRepository
    )
    {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->orderDetailRepository = $orderDetailRepository;
        $this->orderTimelineRepository = $orderTimelineRepository;
    }

    /**
     * Get all orders
     *
     * @return Collection
     */
    public function getAllOrders()
    {
        return $this->orderRepository->all();
    }

    /**
     * Find a order by ID
     *
     * @param int $id
     * @return Model|null
     * @throws Exception
     */
    public function getOrderById($id, $customer)
    {
        $order = $this->orderRepository
            ->with([
                'orderDetails.product.image',
                'paymentTransactions',
                'orderTimeline' => function ($query) {
                    $query->orderBy('created_at', 'desc');
                }
            ])->find($id);
        if (!$order) {
            throw new Exception('Không tìm thấy đơn hàng', 404);
        }

        if ($order->deleted_at) {
            throw new Exception('Đơn hàng đã bị xóa trước đó', 404);
        }

        if (!$customer->group_role && $order->customer_id !== $customer->id) {
            throw new Exception('Bạn không có quyền truy cập vào đơn hàng này', 403);
        }

        return $order;
    }

    /**
     * Create a new order
     *
     * @param array $data
     * @param  $currentUser
     * @return Model
     * @throws Throwable
     */
    public function createOrder(array $data, $currentUser)
    {
        try {
            foreach ($data['products'] as $item) {
                $product = $this->productRepository->find($item['id']);
                if (!$product) {
                    throw new Exception('Sản phẩm không tồn tại', 404);
                } else if ($product->quantity < $item['quantity']) {
                    throw new Exception('Số lượng sản phẩm không đủ', 400);
                } else if ($product->status !== ProductStatusEnum::SELLING->value) {
                    throw new Exception('Sản phẩm không thể đặt hàng', 400);
                }
            }

            DB::beginTransaction();
            $customerId = $currentUser->id;
            $dataOrder = [
                'id' => Str::uuid(),
                'customer_id' => $customerId,
                'order_code' => Str::upper(Str::random(15)),
                'total_amount' => 0,
                'status' => OrderStatusEnum::PENDING->value,
                'recipient_name' => strip_tags($data['name']),
                'recipient_phone' => strip_tags($data['phone']),
                'recipient_address' => strip_tags($data['address']),
                'recipient_ward' => strip_tags($data['ward']),
                'recipient_province' => strip_tags($data['province']),
                'post_code' => strip_tags($data['post_code'] ?? ''),
                'note' => strip_tags($data['note'] ?? ''),
            ];
            $order = $this->orderRepository->create($dataOrder);
            $timeline = $this->orderTimelineRepository->create(
                [
                    'order_id' => $order->id,
                    'type' => OrderTimelineStatusEnum::PENDING->value,
                    'note' => 'Đơn hàng mới được tạo',
                ]
            );

            $totalAmount = 0;
            foreach ($data['products'] as $item) {
                $product = $this->productRepository->find($item['id']);
                $totalAmount += $product['price'] * $item['quantity'];
                $this->orderDetailRepository->create(
                    [
                        'id' => Str::uuid(),
                        'order_id' => $order->id,
                        'product_id' => $product['id'],
                        'quantity' => $item['quantity'],
                        'price' => $product['price'],
                    ]
                );
            }

            $order->update(['total_amount' => $totalAmount]);
            DB::commit();
            return $order;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update status a order
     *
     * @param int $id
     * @return Model
     * @throws Throwable
     */
    public function updateStatusOrder($id, $status)
    {
        $order = $this->orderRepository->findOrFail($id);
        if (!$order) {
            throw new Exception('Không tìm thấy đơn hàng', 404);
        }

        if ($order->deleted_at) {
            throw new Exception('Đơn hàng đã bị xóa', 404);
        }

        $order->update(['status' => $status]);
        return $order;
    }

    /**
     * Get order analytics
     *
     * @return array
     */
    public function getOrderAnalytics(): array
    {
        $totalOrders = $this->orderRepository->count();
        $totalPending = $this->orderRepository->count(['status' => OrderStatusEnum::PENDING->value]);
        $totalProcessing = $this->orderRepository->count(['status' => OrderStatusEnum::PROCESSING->value]);
        $totalCompleted = $this->orderRepository->count(['status' => OrderStatusEnum::COMPLETED->value]);
//        $totalCancelled = $this->orderRepository->count(['status' => OrderStatusEnum::CANCELLED->value]);
        $totalFailed = $this->orderRepository->count(['status' => OrderStatusEnum::PAYMENT_FAILED->value]);

        return [
            'total_orders' => $totalOrders,
            'total_pending' => $totalPending,
            'total_processing' => $totalProcessing,
            'total_completed' => $totalCompleted,
//            'total_cancelled' => $totalCancelled,
            'total_failed' => $totalFailed,
        ];
    }

    /**
     * Get filtered and paginated orders
     *
     * @param array $filters
     * @param $currentUser
     * @param bool $isCustomer
     * @return LengthAwarePaginator
     */
    public function getFilteredOrders(array $filters, $currentUser, bool $isCustomer = true)
    {
        $query = $this->orderRepository->newQuery();
        $criteria = new OrderFilterCriteria($filters);
        if ($isCustomer) {
            $query->where('customer_id', $currentUser->id);
            $query->with([
                'orderDetails.product.image',
            ]);
            $query = $criteria->apply($query, $this->orderRepository);
            $perPage = $filters['per_page'] ?? 10;
        } else {
            $query->with([
                'orderDetails.product.image',
            ]);
            $query = $criteria->apply($query, $this->orderRepository);
            $count = $query->count();
            $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        }
        $currentPage = $filters['page'] ?? 1;
        return $query->paginate($perPage, ['*'], 'page', $currentPage);
    }
}
