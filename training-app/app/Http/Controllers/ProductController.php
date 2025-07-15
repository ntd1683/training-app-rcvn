<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductSearchRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Repositories\Services\ProductService;
use Exception;

class ProductController extends Controller
{
    protected ProductService $productService;

    /**
     * ProductController constructor.
     * @param ProductService $productService
     */
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(ProductSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $products = $this->productService->getFilteredProducts($validated);

            return new ProductCollection($products, 'Lấy danh sách sản phẩm thành công');
        } catch (\Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function store(ProductCreateRequest $request)
    {
        try {
            $validated = $request->validated();
            $product = $this->productService
                ->createProduct($validated, $request->file('image'));
            return new ProductResource($product, null, 'CREATED');
        } catch (Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function edit($id)
    {
        try {
            $product = $this->productService->getProductForEdit($id);
            return new ProductResource($product);
        } catch (Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'NOT_FOUND',
                null,
                'Không tìm thấy sản phẩm hoặc có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function update(ProductUpdateRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $product = $this->productService
                ->updateProduct($id, $validated, $request->file('image'));
            return new ProductResource($product, null, 'CREATED');
        } catch (Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function destroy($id)
    {
        try {
            $this->productService->deleteProduct($id);
            return new ProductResource(null, 'Xóa sản phẩm thành công');
        } catch (Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
