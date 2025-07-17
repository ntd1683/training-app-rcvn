<?php

namespace App\Repositories\Services;

use App\Repositories\Criteria\UserFilterCriteria;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Enums\DefaultRoleEnum;
use Exception;
use Throwable;

/**
 * Class UserService
 * Handles business logic for User operations.
 */
class UserService
{
    protected $userRepository;

    /**
     * UserService constructor.
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get all users
     * @return Collection
     */
    public function getAllUsers()
    {
        return $this->userRepository->all();
    }

    /**
     * Find a user by ID
     * @param int $id
     * @return Model|null
     */
    public function getUserById($id)
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new Exception('Không tìm thấy user', 404);
        }

        if ($user->is_delete) {
            throw new Exception('Người dùng đã bị xóa', 404);
        }

        return $user;
    }

    /**
     * Create a new user
     * @param array $data
     * @param Authenticatable|null $currentUser
     * @return Model
     * @throws Exception|Throwable
     */
    public function createUser(array $data, Authenticatable $currentUser = null)
    {
        if ($currentUser) {
            $currentUserRole = $currentUser->getRoleNames()->first();
            $currentUserRoleValue = DefaultRoleEnum::getValueFromName($currentUserRole);
            $newUserRoleValue = DefaultRoleEnum::getValueFromName($data['group_role'] ?? '');

            if ($currentUserRoleValue <= $newUserRoleValue) {
                throw new Exception('Bạn không có quyền tạo user mới với vai trò này.', 403);
            }
        }

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        DB::beginTransaction();
        try {
            $user = $this->userRepository->create($data);

            if (isset($data['group_role'])) {
                $role = Role::findByName($data['group_role'], 'sanctum');
                if (!$role) {
                    throw new Exception('Vai trò không hợp lệ', 400);
                }
                $user->assignRole($role);
            }

            DB::commit();
            return $user;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update a user
     * @param int $id
     * @param array $data
     * @param \Illuminate\Contracts\Auth\Authenticatable|null $currentUser
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function updateUser($id, array $data, $currentUser = null)
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new Exception('Không tìm thấy user', 404);
        }

        if ($currentUser) {
            $currentUserRole = $currentUser->getRoleNames()->first();
            $currentUserRoleValue = DefaultRoleEnum::getValueFromName($currentUserRole);
            $newUserRoleValue = DefaultRoleEnum::getValueFromName($data['group_role'] ?? $user->group_role);

            if ($currentUserRoleValue <= $newUserRoleValue) {
                throw new Exception('Bạn không có quyền cập nhật user với vai trò này.', 403);
            }
        }

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['is_delete'])) {
            $data['is_delete'] = false;
        }

        DB::beginTransaction();
        try {
            if (isset($data['group_role'])) {
                $role = Role::findByName($data['group_role'], 'sanctum');
                if (!$role) {
                    throw new Exception('Vai trò không hợp lệ', 400);
                }
                $user->syncRoles($data['group_role']);
            }

            $updatedUser = $this->userRepository->update($data, $id);
            DB::commit();
            return $updatedUser;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a user
     * @param int $id
     * @param \Illuminate\Contracts\Auth\Authenticatable|null $currentUser
     * @return bool
     * @throws Exception
     */
    public function deleteUser($id, $currentUser = null)
    {
        if ($currentUser && $currentUser->id === $id) {
            throw new Exception('Bạn không thể xóa chính mình', 403);
        }

        $user = $this->userRepository->find($id);
        if (!$user) {
            throw new Exception('Không tìm thấy user', 404);
        }

        if ($user->is_delete) {
            throw new Exception('User đã bị xóa trước đó', 404);
        }

        \Log::info("UserService: User $currentUser->id Attempting to soft delete user with ID: $id");
        return $this->userRepository->softDelete($id);
    }

    /**
     * Toggle user active status
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function toggleUserStatus($id)
    {
        $user = $this->userRepository->toggleStatus($id);
        if (!$user) {
            throw new Exception('Không tìm thấy user', 404);
        }
        return $user;
    }

    /**
     * Delete a user
     * @param int $id
     * @return bool
     */
    public function destroyUser($id)
    {
        return $this->userRepository->delete($id);
    }

    /**
     * Find a user by email
     * @param string $email
     * @return Model|null
     */
    public function findUserByEmail($email)
    {
        return $this->userRepository->findByEmail($email);
    }

    /**
     * Get filtered and paginated users
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getFilteredUsers(array $filters)
    {
        $query = $this->userRepository->newQuery();

        $criteria = new UserFilterCriteria($filters);
        $query = $criteria->apply($query, $this->userRepository);

        $count = $query->count();

        $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        $currentPage = $filters['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $currentPage);
    }
}
