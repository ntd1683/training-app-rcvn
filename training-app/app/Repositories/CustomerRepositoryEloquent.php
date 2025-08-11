<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Criteria\UserFilterCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use App\Models\User;

/**
 * Class UserRepositoryEloquent
 * Eloquent implementation of User repository.
 */
class CustomerRepositoryEloquent extends BaseRepository implements CustomerRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Customer::class;
    }

    /**
     * Boot up the repository, pushing criteria
     *
     * @return void
     */
    public function boot()
    {
    }

    /**
     * Find a user by email
     *
     * @param  string $email
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function findByEmail($email)
    {
        return $this->findWhere(['email' => $email])->first();
    }
}
