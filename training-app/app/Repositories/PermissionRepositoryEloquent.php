<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Spatie\Permission\Models\Permission;

/**
 * Class PermissionRepositoryEloquent
 * Eloquent implementation of Permission repository.
 */
class PermissionRepositoryEloquent extends BaseRepository implements PermissionRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Permission::class;
    }

    /**
     * Boot up the repository
     *
     * @return void
     */
    public function boot()
    {
    }
}
