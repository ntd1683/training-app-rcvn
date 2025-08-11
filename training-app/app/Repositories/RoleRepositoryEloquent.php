<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Spatie\Permission\Models\Role;

/**
 * Class RoleRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class RoleRepositoryEloquent extends BaseRepository implements RoleRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Role::class;
    }

    /**
     * Boot up the repository
     *
     * @return void
     */
    public function boot()
    {
        // Không đẩy criteria ở đây
    }

    /**
     * Find a role by name
     *
     * @param  string $name
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function findByName($name)
    {
        return $this->findWhere(['name' => $name])->first();
    }
}
