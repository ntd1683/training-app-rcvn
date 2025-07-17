<?php

namespace App\Repositories;

use App\Repositories\Criteria\UserFilterCriteria;
use Prettus\Repository\Eloquent\BaseRepository;
use App\Models\User;

/**
 * Class UserRepositoryEloquent
 * Eloquent implementation of User repository.
 */
class UserRepositoryEloquent extends BaseRepository implements UserRepository
{
    /**
     * Specify Model class name
     * @return string
     */
    public function model()
    {
        return User::class;
    }

    /**
     * Boot up the repository, pushing criteria
     * @return void
     */
    public function boot()
    {
    }

    /**
     * Find a user by email
     * @param string $email
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function findByEmail($email)
    {
        return $this->findWhere(['email' => $email])
            ->where('is_delete', false)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Soft delete a user
     * @param int $id
     * @return bool
     */
    public function softDelete($id)
    {
        $user = $this->find($id);
        if ($user && !$user->is_delete) {
            $user->is_delete = true;
            $user->tokens()->delete();
            return $user->save();
        }
        return false;
    }

    /**
     * Toggle user active status
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function toggleStatus($id)
    {
        $user = $this->find($id);
        if ($user) {
            $user->is_active = !$user->is_active;
            $user->save();
            return $user;
        }
        return null;
    }
}
