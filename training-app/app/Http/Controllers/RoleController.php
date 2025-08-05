<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleCreateRequest;
use App\Http\Requests\RoleSearchRequest;
use App\Http\Requests\RoleUpdateRequest;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Repositories\Services\RoleService;
use Exception;

/**
 * Class RoleController
 * Handles HTTP requests for Role operations.
 */
class RoleController extends Controller
{
    protected $roleService;

    /**
     * RoleController constructor.
     *
     * @param RoleService $roleService
     */
    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(RoleSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $roles = $this->roleService->getFilteredRoles($validated);

            return new RoleCollection($roles, 'Lấy danh sách vai trò thành công');
        } catch (Exception $e) {
            return (new RoleResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function store(RoleCreateRequest $request)
    {
        try {
            $role = $this->roleService->createRole($request->validated());
            return new RoleResource($role, null, 'CREATED');
        } catch (Exception $e) {
            return (new RoleResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function edit($name)
    {
        try {
            $role = $this->roleService->getRoleForEdit($name);
            return new RoleResource($role);
        } catch (Exception $e) {
            return (new RoleResource(null))->errorResponse(
                'NOT_FOUND',
                null,
                'Không tìm thấy vai trò hoặc có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function update(RoleUpdateRequest $request, $name)
    {
        try {
            $role = $this->roleService->updateRole($name, $request->validated());
            return new RoleResource($role, 'Cập nhật vai trò thành công');
        } catch (Exception $e) {
            return (new RoleResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function destroy($name)
    {
        try {
            $this->roleService->deleteRole($name);
            return new RoleResource(null, 'Xóa vai trò thành công');
        } catch (Exception $e) {
            return (new RoleResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function getAll()
    {
        try {
            $roles = $this->roleService->getAllRoles();
            return new RoleResource($roles, 'Lấy danh sách vai trò thành công');
        } catch (\Exception $e) {
            return (new UserResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Lỗi khi lấy danh sách vai trò: ' . $e->getMessage()
            );
        }
    }
}
