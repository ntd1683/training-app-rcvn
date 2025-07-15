<?php

namespace App\Repositories\Services;

use App\Repositories\PermissionRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Exception;

/**
 * Class PermissionService
 * Handles business logic for Permission operations.
 */
class PermissionService
{
    protected $permissionRepository;

    /**
     * PermissionService constructor.
     * @param PermissionRepository $permissionRepository
     */
    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    /**
     * Get all permissions
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPermissions()
    {
        return $this->permissionRepository->all();
    }

    /**
     * Search permissions with filters
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchPermissions(array $filters)
    {
        $query = $this->permissionRepository->newQuery();
        $query->select(['id', 'name', 'guard_name',
            DB::raw('(SELECT COUNT(*) FROM role_has_permissions WHERE permission_id = permissions.id) as roles_count')
        ]);

        $criteria = new \App\Repositories\Criteria\PermissionFilterCriteria($filters);
        $query = $criteria->apply($query, $this->permissionRepository);

        $count = $query->count();
        $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        $currentPage = $filters['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $currentPage);
    }

    /**
     * Create a new permission
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function createPermission(array $data)
    {
        if ($data['permission'] === 'all') {
            $permissionsDefault = ['index', 'store', 'edit', 'update', 'delete'];
            $permissionCreated = [];
            $errorCreated = [];

            foreach ($permissionsDefault as $permission) {
                $name = $data['model'] . '.' . $permission;
                if (Str::length($name) > 255) {
                    return [
                        'success' => false,
                        'message' => "Tên quyền '{$name}' quá dài, tối đa 255 ký tự",
                        'data' => null,
                    ];
                }

                if (!$this->permissionRepository->findWhere(['name' => $name])->first()) {
                    $this->permissionRepository->create([
                        'name' => $name,
                        'guard_name' => 'sanctum',
                    ]);
                    $permissionCreated[] = $name;
                } else {
                    $errorCreated[] = $name;
                }
            }

            if (!empty($errorCreated)) {
                $message = 'Một số quyền đã tồn tại: ' . implode(', ', $errorCreated);
                $message .= !empty($permissionCreated) ?
                    '. Quyền mới được tạo: ' . implode(', ', $permissionCreated) : '';
                return [
                    'success' => false,
                    'message' => $message,
                    'data' => null,
                ];
            }

            return [
                'success' => true,
                'data' => [
                    'permissions' => $permissionCreated,
                    'model' => $data['model'],
                ],
                'message' => 'Tạo quyền thành công',
            ];
        }

        $permission = $this->permissionRepository->create([
            'name' => $data['name'],
            'guard_name' => 'sanctum',
        ]);

        return [
            'success' => true,
            'data' => [
                'name' => $data['name'],
                'permission' => $data['permission'],
                'model' => $data['model'],
                'guard_name' => 'sanctum',
            ],
            'message' => 'Tạo quyền thành công',
        ];
    }

    /**
     * Get a permission for editing
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function getPermissionForEdit($id)
    {
        $permission = $this->permissionRepository->find($id);
        if (!$permission) {
            throw new Exception('Quyền không tồn tại', 404);
        }
        return $permission;
    }

    /**
     * Update a permission
     * @param int $id
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function updatePermission($id, array $data)
    {
        $permission = $this->permissionRepository->find($id);
        if (!$permission) {
            throw new Exception('Quyền không tồn tại', 404);
        }

        return $this->permissionRepository->update(['name' => $data['name']], $id);
    }

    /**
     * Delete a permission
     * @param int $id
     * @return bool
     * @throws Exception
     */
    public function deletePermission($id)
    {
        $permission = $this->permissionRepository->find($id);
        if (!$permission) {
            throw new Exception('Quyền không tồn tại', 404);
        }

        $roles = Role::whereHas('permissions', function ($query) use ($id) {
            $query->where('id', $id);
        })->get();

        if ($roles->isNotEmpty()) {
            throw new Exception('Không thể xóa quyền vì nó đang được sử dụng bởi vai trò khác', 400);
        }

        \Log::info('PermissionService: Attempting to delete permission', ['permission_id' => $id]);
        return $this->permissionRepository->delete($id);
    }
}
