<?php

namespace App\Repositories\Criteria;

use App\Enums\OrderStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Prettus\Repository\Contracts\CriteriaInterface;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Class OrderFilterCriteria
 * Applies filtering criteria for Order queries.
 */
class OrderFilterCriteria implements CriteriaInterface
{
    protected $filters;

    /**
     * OrderFilterCriteria constructor.
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
        if (isset($this->filters['name'])) {
            $searchTerm = '%' . $this->filters['name'] . '%';
            $model->where(function ($query) use ($searchTerm) {
                $query->where('recipient_name', 'like', $searchTerm)
                    ->orWhere('recipient_phone', 'like', $searchTerm)
                    ->orWhere('order_code', 'like', $searchTerm)
                    ->orWhereHas('orderDetails.product', function ($productQuery) use ($searchTerm) {
                        $productQuery->where('name', 'like', $searchTerm)
                            ->orWhere('description', 'like', $searchTerm);
                    });
            });
        }

        $status = $this->filters['status'] ?? null;
        if (isset($status)) {
            if ($status === OrderStatusEnum::PROCESSING) {
                $model->whereIn(
                    'status', [
                        OrderStatusEnum::PENDING,
                        OrderStatusEnum::PROCESSING
                    ]
                );
            } else {
                $model->where('status', $this->filters['status']);
            }
        }

        if (isset($this->filters['date'])) {
            $model->whereDate('created_at', $this->filters['date']);
        }

        $sortBy = $this->filters['sort_by'] ?? 'created_at';
        if ($sortBy === 'date') {
            $sortBy = 'created_at';
        } elseif ($sortBy === 'name') {
            $sortBy = 'order_code';
        }

        $sortOrder = $this->filters['sort_order'] ?? 'desc';
        $model->orderBy($sortBy, $sortOrder);
        return $model;
    }
}
