<?php

namespace App\Repositories\Criteria;

use App\Enums\ProductStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class BannerFilterCriteria
 * Applies filtering criteria for Banner queries.
 */
class BannerFilterCriteria implements CriteriaInterface
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
     * @param Builder $model
     * @param RepositoryInterface $repository
     * @return Builder
     */
    public function apply($model, RepositoryInterface $repository)
    {
        if (isset($this->filters['type'])) {
            $model->where('type', '=', $this->filters['type']);
        }

        $model->orderBy('index');
        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);

        return $model;
    }
}
