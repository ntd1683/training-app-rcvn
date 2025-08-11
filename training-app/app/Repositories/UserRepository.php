<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Interface UserRepository
 * Defines the contract for User repository.
 */
interface UserRepository extends RepositoryInterface
{
    /**
     * Find a user by email
     *
     * @param  string $email
     * @return Model|null
     */
    public function findByEmail($email);

    /**
     * Soft delete a user
     *
     * @param  int $id
     * @return bool
     */
    public function softDelete($id);

    /**
     * Toggle user active status
     *
     * @param  int $id
     * @return Model|null
     */
    public function toggleStatus($id);
}
