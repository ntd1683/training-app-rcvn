<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductSearchRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Image;
use App\Models\Product;
use HTMLPurifier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(ProductSearchRequest $request)
    {
        try {
            $validated = $request->validated();

            $query = Product::query();

            if (!empty($validated['name'])) {
                $query->where('name', 'like', '%' . $validated['name'] . '%');
            }

            if (isset($validated['price_from'])) {
                $query->where('price', '>=', $validated['price_from']);
            }

            if (isset($validated['price_to'])) {
                $query->where('price', '<=', $validated['price_to']);
            }

            if (isset($validated['status'])) {
                $query->where('status', $validated['status']);
            }

            $sortBy = $validated['sort_by'] ?? 'created_at';
            $sortOrder = $validated['sort_order'] ?? 'desc';
            $query->orderBy($sortBy, $sortOrder);

            if ($query->count() > 20) {
                $perPage = $validated['per_page'] ?? 10;
            } else {
                $perPage = 20;
            }

            $currentPage = $validated['page'] ?? 1;
            $product = $query->paginate($perPage, ['*'], 'page', $currentPage);
            $product->getCollection()->transform(function ($item) {
                $item->image_url = $item->image ? asset('storage/' . $item->image->path) : null;
                unset($item->image);
                return $item;
            });

            return response()->json([
                'success' => true,
                'data' => $product->items(),
                'pagination' => [
                    'current_page' => $product->currentPage(),
                    'per_page' => $product->perPage(),
                    'total' => $product->total(),
                    'last_page' => $product->lastPage(),
                    'from' => $product->firstItem(),
                    'to' => $product->lastItem(),
                    'has_next_page' => $product->hasMorePages(),
                    'has_prev_page' => $product->currentPage() > 1
                ],
                'message' => 'Lấy danh sách sản phẩm thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(ProductCreateRequest $request)
    {
        try {
            $validated = $request->validated();
            DB::beginTransaction();

            $id = ucfirst($validated['name'])[0] . rand(1, 999999999);
            $configHtml = getHTMLPurifierConfig();
            $purifier = new HTMLPurifier($configHtml);
            $description = $purifier->purify($validated['description'] ?? '');

            $product = new Product();
            $product->id = $id;
            $product->name = strip_tags($validated['name']);
            $product->description = $description;
            $product->price = $validated['price'];
            $product->currency = $validated['currency'];
            $product->status = $validated['status'];
            $product->user_id = auth()->id();

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $hash = hash_file('sha256', $image->getRealPath());
                $extension = $image->getClientOriginalExtension();
                $filename = $hash . '.' . $extension;

                $path = $image->storeAs(
                    "uploads/images/products/" . date('Y.m.d'),
                    $filename,
                    'public'
                );
                $originalName = sanitizeFilename($image->getClientOriginalName());
                $mimeType = $image->getMimeType();
                $imageRecord = Image::create([
                    'filename' => $filename,
                    'original_name' => $originalName,
                    'path' => $path,
                    'size' => $image->getSize(),
                    'mime_type' => $mimeType,
                    'user_id' => auth()->id(),
                ]);

                $product->image_id = $imageRecord->id;
            }

            $product->save();
            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Thêm sản phẩm thành công'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function edit($id)
    {
        try {
            $product = Product::with('image')->findOrFail($id);
            if ($product->image) {
                $product->image_url = asset('storage/' . $product->image->path);
            } else {
                $product->image_url = null;
            }
            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Lấy thông tin sản phẩm thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(ProductUpdateRequest $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            if ($product->deleted_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm đã bị xóa trước đó'
                ], 404);
            }
            Log::info("Updating product ID: {$product->id} by user ID: " . auth()->id());
            $validated = $request->validated();
            DB::beginTransaction();

            $configHtml = getHTMLPurifierConfig();
            $purifier = new HTMLPurifier($configHtml);
            $description = $purifier->purify($validated['description'] ?? '');

            $product->name = strip_tags($validated['name']);
            $product->description = $description;
            $product->price = $validated['price'];
            $product->currency = $validated['currency'];
            $product->status = $validated['status'];

            if ($request->hasFile('image')) {
                if ($product->image) {
                    Log::info("Deleting old image for product ID: {$product->image->id}");
                    // Delete old image if exists
                    Storage::disk('public')->delete($product->image->path);
                    $product->image()->delete();
                }

                $image = $request->file('image');
                $hash = hash_file('sha256', $image->getRealPath());
                $extension = $image->getClientOriginalExtension();
                $filename = $hash . '.' . $extension;

                $path = $image->storeAs(
                    "uploads/images/products/" . date('Y.m.d'),
                    $filename,
                    'public'
                );
                $originalName = sanitizeFilename($image->getClientOriginalName());
                $mimeType = $image->getMimeType();
                $imageRecord = Image::create([
                    'filename' => $filename,
                    'original_name' => $originalName,
                    'path' => $path,
                    'size' => $image->getSize(),
                    'mime_type' => $mimeType,
                    'user_id' => auth()->id(),
                ]);

                $product->image_id = $imageRecord->id;
            } elseif ($product->image && empty($validated['image_url'])) {
//              Delete old image if user delete image old
                Log::info("Deleting old image: {$product->image->path}");
                Storage::disk('public')->delete($product->image->path);
                $product->image()->delete();
                $product->image_id = null;
            }
            $product->save();
            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $product,
                'message' => 'Cập nhật sản phẩm thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            if ($product->deleted_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm đã bị xóa trước đó'
                ], 404);
            }

            // Check if the product has an image and delete it
            if ($product->image) {
                Storage::disk('public')->delete($product->image->path);
                $product->image()->delete();
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sản phẩm thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
