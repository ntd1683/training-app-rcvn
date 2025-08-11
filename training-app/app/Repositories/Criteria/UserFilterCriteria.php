<?php

namespace App\Repositories\Criteria;

use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class UserFilterCriteria
 * Applies filtering criteria for User queries.
 */
class UserFilterCriteria implements CriteriaInterface
{
    protected $filters;

    /**
     * UserFilterCriteria constructor.
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
     * @param  \Illuminate\Database\Eloquent\Builder $model
     * @param  RepositoryInterface                   $repository
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply($model, RepositoryInterface $repository)
    {
        $model->where('is_delete', '=', false);
        $model->select(['id', 'name', 'email', 'group_role', 'is_active']);

        if (!empty($this->filters['search_name'])) {
            $model->where('name', 'like', '%' . $this->filters['search_name'] . '%');
        }

        if (!empty($this->filters['search_email'])) {
            $model->where('email', 'like', '%' . $this->filters['search_email'] . '%');
        }

        if (!empty($this->filters['filter_group'])) {
            $model->where('group_role', $this->filters['filter_group']);
        }

        if (isset($this->filters['filter_status'])) {
            $model->where('is_active', $this->filters['filter_status']);
        }

        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);

        return $model;
    }
}
