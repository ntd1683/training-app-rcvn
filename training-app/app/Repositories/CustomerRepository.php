<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Interface Customer Repository
 * Defines the contract for Customer repository.
 */
interface CustomerRepository extends RepositoryInterface
{
    /**
     * Find a customer by email
     *
     * @param  string $email
     * @return Model|null
     */
    public function findByEmail($email);
}
