<?php

namespace App\Repositories;

use App\Models\Payment;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class PaymentRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class PaymentRepositoryEloquent extends BaseRepository implements PaymentRepository
{
    /**
     * Specify Model class name
     * @return string
     */
    public function model()
    {
        return Payment::class;
    }

    /**
     * Boot up the repository, pushing criteria
     * @return void
     */
    public function boot()
    {
    }
}
