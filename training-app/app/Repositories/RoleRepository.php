<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\RepositoryInterface;

/**
 * Interface ProductRepository.
 *
 * @package namespace App\Repositories;
 */

interface RoleRepository extends RepositoryInterface
{
    /**
     * Find a role by name
     * @param string $name
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function findByName($name);
}
