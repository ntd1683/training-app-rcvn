<?php

namespace App\Repositories\Criteria;

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
     * @param array $filters
     */
    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    /**
     * Apply criteria in query repository
     * @param \Illuminate\Database\Eloquent\Builder $model
     * @param RepositoryInterface $repository
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply($model, RepositoryInterface $repository)
    {
        if (!empty($this->filters['name'])) {
            $model->where('name', 'like', '%' . $this->filters['name'] . '%');
        }

        if (isset($this->filters['price_from'])) {
            $model->where('price', '>=', $this->filters['price_from']);
        }

        if (isset($this->filters['price_to'])) {
            $model->where('price', '<=', $this->filters['price_to']);
        }

        if (isset($this->filters['status'])) {
            $model->where('status', $this->filters['status']);
        }

        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);

        return $model;
    }
}
