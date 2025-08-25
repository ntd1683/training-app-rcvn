<?php

namespace App\Repositories\Criteria;

use Illuminate\Database\Eloquent\Builder;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class CustomerFilterCriteria
 * Applies filtering criteria for Customer queries.
 */
class CustomerFilterCriteria implements CriteriaInterface
{
    protected array $filters;

    /**
     * CustomerFilterCriteria constructor.
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
     * @param Builder $model
     * @param RepositoryInterface $repository
     * @return Builder
     */
    public function apply($model, RepositoryInterface $repository)
    {
        $model->withTotalOrders();

        if (!empty($this->filters['search_name'])) {
            $model->where('name', 'like', '%' . $this->filters['search_name'] . '%');
        }

        if (!empty($this->filters['search_email'])) {
            $model->where('email', 'like', '%' . $this->filters['search_email'] . '%');
        }

        if (isset($this->filters['filter_status'])) {
            switch ($this->filters['filter_status']) {
                case 0:
                    $model->onlyTrashed();
                    break;
                case 1:
                    $model->whereNull('deleted_at');
                    break;
                case 2:
                    $model->withTrashed();
                    break;
            }
        } else {
            $model->whereNull('deleted_at');
        }


        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);

        return $model;
    }
}
