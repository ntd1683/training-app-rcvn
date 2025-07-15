<?php

namespace App\Repositories\Criteria;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class RoleFilterCriteria
 * Applies filtering criteria for Role queries.
 */
class RoleFilterCriteria implements CriteriaInterface
{
    protected $filters;

    /**
     * RoleFilterCriteria constructor.
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

        if (!empty($this->filters['permissions'])) {
            $model->whereHas('permissions', function ($query) {
                $query->whereIn('name', $this->filters['permissions']);
            });
        }
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);

        return $model;
    }
}
