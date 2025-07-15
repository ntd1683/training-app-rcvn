<?php

namespace App\Repositories\Services;

use App\Repositories\Criteria\RoleFilterCriteria;
use App\Repositories\RoleRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Exception;

/**
 * Class RoleService
 * Handles business logic for Role operations.
 */
class RoleService
{
    protected RoleRepository $roleRepository;

    /**
     * RoleService constructor.
     * @param RoleRepository $roleRepository
     */
    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    /**
     * Get all roles
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllRoles()
    {
        return $this->roleRepository->all();
    }

    /**
     * Create a new role
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function createRole(array $data)
    {
        DB::beginTransaction();
        try {
            $role = $this->roleRepository->create(['name' => $data['name']]);
            Log::info('Role created', $role->toArray());

            if (!empty($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }
            DB::commit();
            return $role;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get a role for editing
     * @param string $name
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function getRoleForEdit($name)
    {
        $role = $this->roleRepository->findByName($name);
        if (!$role) {
            throw new Exception('Không tìm thấy vai trò', 404);
        }
        $role->load('permissions:id,name');
        return $role;
    }

    /**
     * Update a role
     * @param string $name
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function updateRole($name, array $data)
    {
        $role = $this->roleRepository->findByName($name);
        if (!$role) {
            throw new Exception('Không tìm thấy vai trò', 404);
        }

        DB::beginTransaction();
        try {
            $role = $this->roleRepository->update(['name' => $data['name']], $role->id);
            if (!empty($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }
            DB::commit();
            return $role;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a role
     * @param string $name
     * @return bool
     * @throws Exception
     */
    public function deleteRole($name)
    {
        $role = $this->roleRepository->findByName($name);
        if (!$role) {
            throw new Exception('Không tìm thấy vai trò', 404);
        }

        $usersWithRole = $role->users()->count();
        if ($usersWithRole > 0) {
            throw new Exception('Không thể xóa vai trò vì có người dùng đang sử dụng', 400);
        }

        \Log::info('RoleService: Attempting to delete role', ['role' => $role->name]);
        return $this->roleRepository->delete($role->id);
    }



    /**
     * Search roles with filters
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getFilteredRoles(array $filters)
    {
        $query = $this->roleRepository->newQuery()->with(['permissions' => function ($query) {
            $query->select('id', 'name');
        }]);

        $query->select(['id', 'name', 'guard_name',
            DB::raw('(SELECT COUNT(*) FROM model_has_roles WHERE role_id = roles.id) as users_count')
        ]);

        $criteria = new RoleFilterCriteria($filters);
        $query = $criteria->apply($query, $this->roleRepository);

        $count = $query->count();
        $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        $currentPage = $filters['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $currentPage);
    }
}
