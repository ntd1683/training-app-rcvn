<?php

namespace App\Http\Controllers;

use App\Http\Requests\BannerSearchRequest;
use App\Http\Requests\ProductCreateRequest;
use App\Http\Requests\ProductSearchRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\BannerCollection;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Repositories\Services\BannerService;
use App\Repositories\Services\ProductService;
use Exception;

class BannerController extends Controller
{
    protected BannerService $bannerService;

    /**
     * BannerController constructor.
     *
     * @param BannerService $bannerService
     */
    public function __construct(BannerService $bannerService)
    {
        $this->bannerService = $bannerService;
    }

    public function index(BannerSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $banners = $this->bannerService->searchBanners($validated);
            return new BannerCollection($banners, 'Lấy danh sách banners thành công');
        } catch (\Exception $e) {
            return (new ProductResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
