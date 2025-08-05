<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionCreateRequest;
use App\Http\Requests\PermissionSearchRequest;
use App\Http\Requests\PermissionUpdateRequest;
use App\Repositories\Services\PermissionService;

/**
 * Class PermissionController
 * Handles HTTP requests for Permission operations.
 */
class PermissionController extends Controller
{
    protected $permissionService;

    /**
     * PermissionController constructor.
     *
     * @param PermissionService $permissionService
     */
    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Get a paginated list of permissions with optional filters
     *
     * @param  PermissionSearchRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(PermissionSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $permissions = $this->permissionService->searchPermissions($validated);

            return response()->json(
                [
                'success' => true,
                'data' => $permissions->items(),
                'pagination' => [
                    'current_page' => $permissions->currentPage(),
                    'per_page' => $permissions->perPage(),
                    'total' => $permissions->total(),
                    'last_page' => $permissions->lastPage(),
                    'from' => $permissions->firstItem(),
                    'to' => $permissions->lastItem(),
                    'has_next_page' => $permissions->hasMorePages(),
                    'has_prev_page' => $permissions->currentPage() > 1,
                ],
                'message' => 'Lấy danh sách quyền thành công',
                ], 200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách quyền',
                'errors' => $e->getMessage(),
                ], 500
            );
        }
    }

    /**
     * Create a new permission
     *
     * @param  PermissionCreateRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PermissionCreateRequest $request)
    {
        try {
            $result = $this->permissionService->createPermission($request->validated());
            return response()->json(
                [
                'success' => $result['success'],
                'data' => $result['data'],
                'message' => $result['message'],
                ], $result['success'] ? 201 : 400
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                'success' => false,
                'message' => 'Lỗi khi tạo quyền',
                'errors' => $e->getMessage(),
                ], 500
            );
        }
    }

    /**
     * Get a permission for editing
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id)
    {
        try {
            $permission = $this->permissionService->getPermissionForEdit($id);
            return response()->json(
                [
                'success' => true,
                'data' => $permission,
                'message' => 'Lấy quyền thành công',
                ], 200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin quyền',
                'errors' => $e->getMessage(),
                ], $e->getCode() ?: 500
            );
        }
    }

    /**
     * Update a permission
     *
     * @param  PermissionUpdateRequest $request
     * @param  int                     $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(PermissionUpdateRequest $request, $id)
    {
        try {
            $permission = $this->permissionService->updatePermission($id, $request->validated());
            return response()->json(
                [
                'success' => true,
                'data' => $permission,
                'message' => 'Cập nhật quyền thành công',
                ], 200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                'success' => false,
                'message' => 'Lỗi khi cập nhật quyền',
                'errors' => $e->getMessage(),
                ], $e->getCode() ?: 500
            );
        }
    }

    /**
     * Delete a permission
     *
     * @param  int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->permissionService->deletePermission($id);
            return response()->json(
                [
                'success' => true,
                'message' => 'Xóa quyền thành công',
                ], 200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                'success' => false,
                'message' => 'Lỗi khi xóa quyền',
                'errors' => $e->getMessage(),
                ], $e->getCode() ?: 500
            );
        }
    }

    /**
     * Get all permissions
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAll()
    {
        try {
            $permissions = $this->permissionService->getAllPermissions();
            return response()->json(
                [
                'success' => true,
                'data' => $permissions,
                'message' => 'Lấy danh sách quyền thành công',
                ], 200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách quyền',
                'errors' => $e->getMessage(),
                ], 500
            );
        }
    }
}
