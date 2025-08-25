<?php

namespace App\Repositories\Services;

use App\Repositories\Criteria\ProductFilterCriteria;
use App\Repositories\ProductRepository;
use HTMLPurifier;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Throwable;

/**
 * Class Product Service
 * Handles business logic for Product operations.
 */
class ProductService
{
    protected ProductRepository $productRepository;
    protected ImageService $imageService;

    /**
     * ProductService constructor.
     *
     * @param ProductRepository $productRepository
     * @param ImageService      $imageService
     */
    public function __construct(ProductRepository $productRepository, ImageService $imageService)
    {
        $this->productRepository = $productRepository;
        $this->imageService = $imageService;
    }

    /**
     * Get all products
     *
     * @return Collection
     */
    public function getAllProducts()
    {
        return $this->productRepository->all();
    }

    /**
     * Find a product by ID
     *
     * @param  int $id
     * @return Model|null
     * @throws Exception
     */
    public function getProductById($id)
    {
        $product = $this->productRepository->find($id);
        if (!$product) {
            throw new Exception('Không tìm thấy sản phẩm', 404);
        }

        if ($product->is_delete) {
            throw new Exception('Sản phẩm đã bị xóa', 404);
        }

        return $product;
    }

    /**
     * Create a new product
     *
     * @param  array $data
     * @param  null  $image
     * @return Model
     * @throws Throwable
     */
    public function createProduct(array $data, $image = null)
    {
        try {
            DB::beginTransaction();

            $id = ucfirst($data['name'])[0] . rand(1, 999999999);
            $configHtml = getHTMLPurifierConfig();
            $purifier = new HTMLPurifier($configHtml);
            $description = $purifier->purify($data['description'] ?? '');

            $productData = [
                'id' => $id,
                'name' => strip_tags($data['name']),
                'description' => $description,
                'price' => $data['price'],
                'currency' => $data['currency'],
                'status' => $data['status'],
                'user_id' => auth()->id(),
            ];

            if ($image) {
                $imageRecord = $this->imageService->createImage($image, auth()->id());
                $productData['image_id'] = $imageRecord->id;
            }

            $product = $this->productRepository->create($productData);
            DB::commit();
            return $product;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update a product
     *
     * @param  int   $id
     * @param  array $data
     * @param  null  $image
     * @return Model
     * @throws Throwable
     */
    public function updateProduct($id, array $data, $image = null)
    {
        $product = $this->productRepository->find($id);
        if (!$product) {
            throw new Exception('Không tìm thấy sản phẩm', 404);
        }

        if ($product->deleted_at) {
            throw new Exception('Sản phẩm đã bị xóa', 404);
        }

        try {
            DB::beginTransaction();
            $configHtml = getHTMLPurifierConfig();
            $purifier = new HTMLPurifier($configHtml);
            $description = $purifier->purify($data['description'] ?? '');

            $productData = [
                'name' => strip_tags($data['name']),
                'description' => $description,
                'price' => $data['price'],
                'currency' => $data['currency'],
                'status' => $data['status'],
            ];

            if ($image) {
                if ($product->image) {
                    Log::info("Deleting old image for product ID: {$product->image->id}");
                    // Delete old image if exists
                    $this->imageService->deleteImage($product->image->id);
                }
                $imageRecord = $this->imageService->createImage($image, auth()->id());
                $productData['image_id'] = $imageRecord->id;
            } elseif ($product->image && empty($validated['image_url'])) {
                //              Delete old image if user delete image old
                Log::info("Deleting old image: {$product->image->path}");
                $this->imageService->deleteImage($product->image->id);
                $product->image_id = null;
            }

            $updatedProduct = $this->productRepository->update($productData, $id);
            DB::commit();
            return $updatedProduct;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a product
     *
     * @param  int                                             $id
     * @param  \Illuminate\Contracts\Auth\Authenticatable|null $currentUser
     * @return bool
     * @throws Exception
     */
    public function deleteProduct($id)
    {
        $product = $this->productRepository->find($id);
        if (!$product) {
            throw new Exception('Không tìm thấy sản phẩm', 404);
        }
        if ($product->deleted_at) {
            throw new Exception('Sản phẩm đã bị xóa trước đó', 404);
        }

        //        Todo: Uncomment if you want to delete image when soft delete product
        //        if ($product->image) {
        //            $this->imageService->deleteImage($product->image->id);
        //        }

        \Log::info('ProductService: Attempting to delete product', ['product_id' => $id]);
        return $this->productRepository->delete($id);
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
        $product = $this->productRepository->find($id);
        if (!$product) {
            throw new Exception('Không tìm thấy sản phẩm', 404);
        }
        if ($product->deleted_at) {
            throw new Exception('Sản phẩm đã bị xóa trước đó', 404);
        }

        $product->image_url = $product->image ? asset('storage/' . $product->image->path) : null;
        return $product;
    }

    /**
     * Get filtered and paginated products
     *
     * @param  array $filters
     * @return LengthAwarePaginator
     */
    public function getFilteredProducts(array $filters)
    {
        $query = $this->productRepository->newQuery();

        $criteria = new ProductFilterCriteria($filters);
        $query = $criteria->apply($query, $this->productRepository);

        $count = $query->count();

        $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        $currentPage = $filters['page'] ?? 1;
        $products = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $products->getCollection()->transform(
            function ($item) {
                $item->image_url = $item->image ? asset('storage/' . $item->image->path) : null;
                unset($item->image);
                $item->author = $item->user ? $item->user->name : 'N/A';
                return $item;
            }
        );
        $max = $this->productRepository->max('price');
        $products->max_value = round($max / 100) * 100;
        return $products;
    }
}
