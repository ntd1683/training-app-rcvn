<?php

namespace App\Repositories\Services;

use App\Enums\OrderStatusEnum;
use App\Enums\ProductStatusEnum;
use App\Repositories\OrderDetailRepository;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Str;
use Throwable;

/**
 * Class Product Service
 * Handles business logic for Product operations.
 */
class OrderService
{
    protected OrderRepository $orderRepository;
    protected ProductRepository $productRepository;
    protected OrderDetailRepository $orderDetailRepository;
    /**
     * Order constructor.
     *
     * @param OrderRepository   $orderRepository
     * @param ProductRepository $productRepository
     * @
     */
    public function __construct(
        OrderRepository $orderRepository,
        ProductRepository $productRepository,
        OrderDetailRepository $orderDetailRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->orderDetailRepository = $orderDetailRepository;
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
     * @param  int $id
     * @return Model|null
     * @throws Exception
     */
    public function getOrderById($id)
    {
        $order = $this->orderRepository->find($id);
        if (!$order) {
            throw new Exception('Không tìm thấy đơn hàng', 404);
        }

        if ($order->is_delete) {
            throw new Exception('Đơn hàng đã bị xóa', 404);
        }

        return $order;
    }

    /**
     * Create a new order
     *
     * @param  array $data
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
                'order_code' => Str::uuid(),
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
     * @param  int $id
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
     * Get a product for editing
     *
     * @param  int $id
     * @return Model
     * @throws Exception
     */
    public function getProductForEdit($id)
    {
        //        $product = $this->productRepository->find($id);
        //        if (!$product) {
        //            throw new Exception('Không tìm thấy sản phẩm', 404);
        //        }
        //        if ($product->deleted_at) {
        //            throw new Exception('Sản phẩm đã bị xóa trước đó', 404);
        //        }
        //
        //        $product->image_url = $product->image ? asset('storage/' . $product->image->path) : null;
        //        return $product;
    }

    /**
     * Get filtered and paginated products
     *
     * @param  array $filters
     * @return LengthAwarePaginator
     */
    public function getFilteredProducts(array $filters)
    {
        //        $query = $this->productRepository->newQuery();
        //
        //        $criteria = new ProductFilterCriteria($filters);
        //        $query = $criteria->apply($query, $this->productRepository);
        //
        //        $count = $query->count();
        //
        //        $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        //        $currentPage = $filters['page'] ?? 1;
        //        $products = $query->paginate($perPage, ['*'], 'page', $currentPage);
        //        $products->getCollection()->transform(function ($item) {
        //            $item->image_url = $item->image ? asset('storage/' . $item->image->path) : null;
        //            unset($item->image);
        //            $item->author = $item->user ? $item->user->name : 'N/A';
        //            return $item;
        //        });
        //        $max = $this->productRepository->max('price');
        //        $products->max_value = round($max / 100) * 100;
        //        return $products;
    }
}
