<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderTimeline;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class OrderTimelineRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class OrderTimelineRepositoryEloquent extends BaseRepository implements OrderTimelineRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return OrderTimeline::class;
    }

    /**
     * Boot up the repository, pushing criteria
     *
     * @return void
     */
    public function boot()
    {
    }
}
