<?php

namespace App\Repositories\Services;

use App\Repositories\BannerRepository;
use App\Repositories\Criteria\BannerFilterCriteria;
use App\Repositories\Criteria\PermissionFilterCriteria;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

/**
 * Class BannerService
 * Handles business logic for Banner operations.
 */
class BannerService
{
    protected $bannerRepository;

    /**
     * Banner Service constructor.
     * @param BannerRepository $bannerRepository
     */
    public function __construct(BannerRepository $bannerRepository)
    {
        $this->bannerRepository = $bannerRepository;
    }

    /**
     * Get all banners
     * @return Collection
     */
    public function getAllBanners()
    {
        return $this->bannerRepository->all();
    }

    /**
     * Search banners with filters
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchBanners(array $filters)
    {
        $query = $this->bannerRepository->newQuery();

        $criteria = new BannerFilterCriteria($filters);
        $query = $criteria->apply($query, $this->bannerRepository);

        $count = $query->count();
        $perPage = $filters['per_page'] ?? 10;
        $currentPage = $filters['page'] ?? 1;

        $banners = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $banners->getCollection()->transform(function ($item) {
            if ($item->image) {
                $item->image_url = $item->image ? asset('storage/' . $item->image->path) : null;
            } else {
                if($item->product) {
                    $item->image_url = $item->product->image ? asset('storage/' . $item->product->image->path) : null;
                }
            }
            unset($item->image);
            return $item;
        });

        return $banners;
    }
}
