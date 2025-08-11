<?php

namespace App\Repositories;

use App\Models\PaymentTransaction;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class PaymentTransactionRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class PaymentTransactionRepositoryEloquent extends BaseRepository implements PaymentTransactionRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return PaymentTransaction::class;
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
