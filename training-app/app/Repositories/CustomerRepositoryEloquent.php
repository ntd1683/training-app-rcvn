<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Repositories\Criteria\UserFilterCriteria;
use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Eloquent\BaseRepository;
use App\Models\User;

/**
 * Class CustomerRepositoryEloquent
 * Eloquent implementation of Customer repository.
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
     * Find a customer by email
     *
     * @param  string $email
     * @return Model|null
     */
    public function findByEmail($email)
    {
        return $this->findWhere(['email' => $email])->first();
    }

    /**
     * Find a customer by provider ID
     *
     * @param  string $providerId
     * @return Model|null
     */
    public function findByProviderId(string $providerId)
    {
        return $this->findWhere(['provider_id' => $providerId])->first();
    }

    /**
     * Reset the deleted_at field for a customer (restore soft-deleted customer)
     *
     * @param  int $id
     * @return bool
     */
    public function resetDeletedAt($id)
    {
        $customer = $this->withTrashed()->find($id);
        if ($customer && $customer->trashed()) {
            $customer->restore();
            return true;
        }
        return false;
    }
}
