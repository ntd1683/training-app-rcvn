<?php

namespace App\Repositories\Criteria;

use App\Enums\ProductStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class ProductFilterCriteria
 * Applies filtering criteria for Product queries.
 */
class ProductFilterCriteria implements CriteriaInterface
{
    protected $filters;

    /**
     * ProductFilterCriteria constructor.
     *
     * @param array $filters
     */
    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    /**
     * Apply criteria in query repository
     *
     * @param  Builder             $model
     * @param  RepositoryInterface $repository
     * @return Builder
     */
    public function apply($model, RepositoryInterface $repository)
    {
        $model->withSoldCount();
        if (!empty($this->filters['name'])) {
            $searchTerm = '%' . $this->filters['name'] . '%';
            $model->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhere('id', 'like', $searchTerm);
            });
        }

        if (isset($this->filters['price_from'])) {
            $model->where('price', '>=', $this->filters['price_from']);
        }

        if (isset($this->filters['price_to'])) {
            $model->where('price', '<=', $this->filters['price_to']);
        }

        if (isset($this->filters['currency'])) {
            $model->where('currency', $this->filters['currency']);
        }

        $status = $this->filters['status'] ?? null;
        if (isset($status)) {
            if(ProductStatusEnum::getBoth($status)) {
                $model->whereIn(
                    'status', [
                    ProductStatusEnum::SELLING,
                    ProductStatusEnum::OUT_OF_STOCK
                    ]
                );
                $model->orderBy('status');
            } else {
                $model->where('status', $this->filters['status']);
            }
        }

        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        if($sortBy === 'popular') {
            $sortBy = 'sold_count';
            $sortOrder = 'desc';
        }
        $model->orderBy($sortBy, $sortOrder);
        return $model;
    }
}
