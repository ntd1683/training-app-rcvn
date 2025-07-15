<?php

namespace App\Repositories\Criteria;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class PermissionFilterCriteria
 * Applies filtering criteria for Permission queries.
 */
class PermissionFilterCriteria implements CriteriaInterface
{
    protected $filters;

    /**
     * PermissionFilterCriteria constructor.
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
        if (!empty($this->filters['selected'])) {
            $model->whereNotIn('id', $this->filters['selected']);
        }

        if (!empty($this->filters['name'])) {
            $model->where('name', 'like', '%' . $this->filters['name'] . '%');
        }

        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);

        return $model;
    }
}
