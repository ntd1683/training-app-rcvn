<?php

namespace App\Repositories;

use App\Models\OrderDetail;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class OrderDetailRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class OrderDetailRepositoryEloquent extends BaseRepository implements OrderDetailRepository
{
    /**
     * Specify Model class name
     * @return string
     */
    public function model()
    {
        return OrderDetail::class;
    }

    /**
     * Boot up the repository, pushing criteria
     * @return void
     */
    public function boot()
    {
    }
}
