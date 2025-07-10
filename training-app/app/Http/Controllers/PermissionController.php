<?php

namespace App\Http\Controllers;

use App\Http\Requests\PermissionSearchRequest;
use App\Http\Requests\PermissionCreateRequest;
use App\Http\Requests\PermissionUpdateRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function index(PermissionSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $query = Permission::query();
            $query->select(
                ['id', 'name', 'guard_name',
                    DB::raw('(SELECT COUNT(*) FROM role_has_permissions WHERE permission_id = permissions.id) as roles_count')
                ]);

            if (!empty($validated['selected'])) {
                $query->whereNotIn('id', $validated['selected']);
            }

            if (!empty($validated['name'])) {
                $query->where('name', 'like', '%' . $validated['name'] . '%');
            }

            $sortBy = $validated['sort_by'] ?? 'created_at';
            $sortOrder = $validated['sort_order'] ?? 'desc';
            $query->orderBy($sortBy, $sortOrder);

            if ($query->count() > 20) {
                $perPage = $validated['per_page'] ?? 10;
            } else {
                $perPage = 20;
            }

            $currentPage = $validated['page'] ?? 1;
            $permissions = $query->paginate($perPage, ['*'], 'page', $currentPage);

            return response()->json([
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
                'message' => 'Lấy danh sách vai trò thành công',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách vai trò',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(PermissionCreateRequest $request)
    {
        try {
            $validated = $request->validated();

            if ($validated['permission'] === 'all') {
                $permissionsDefault = ['index', 'store', 'edit', 'update', 'delete'];
                $permissionCreated = [];
                $errorCreated = [];
                foreach ($permissionsDefault as $permission) {
                    $name = $validated['model'] . '.' . $permission;
                    if(Str::length($name) > 255) {
                        return response()->json([
                            'success' => false,
                            'message' => "Tên quyền '{$name}' quá dài, tối đa 255 ký tự",
                        ], 400);
                    }

                    if (!Permission::where('name', $name)->exists()) {
                        Permission::create([
                            'name' => $name,
                            'guard_name' => 'sanctum',
                        ]);
                        $permissionCreated[] = $name;
                    } else {
                        $errorCreated[] = $name;
                    }
                }

                if (!empty($errorCreated)) {
                    $message =  'Một số quyền đã tồn tại: ' . implode(', ', $errorCreated);
                    $message .= !empty($permissionCreated) ? '. Quyền mới được tạo: ' . implode(', ', $permissionCreated) : '';
                    return response()->json([
                        'success' => false,
                        'message' => $message,
                    ], 400);
                }
            } else {
                Permission::create([
                    'name' => $validated['name'],
                    'guard_name' => 'sanctum',
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'name' => $validated['name'],
                    'permission' => $validated['permission'],
                    'model' => $validated['model'],
                    'guard_name' => 'sanctum',
                ],
                'message' => 'Tạo quyền thành công',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo quyền',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function edit($id)
    {
        $permission = Permission::find($id);
        if (!$permission) {
            return response()->json([
                'success' => false,
                'message' => 'Quyền không tồn tại',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $permission,
            'message' => 'Lấy quyền thành công',
        ], 200);
    }

    public function update(PermissionUpdateRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $permission = Permission::findOrFail($id);
            $permission->name = $validated['name'];
            $permission->save();

            return response()->json([
                'success' => true,
                'data' => $permission,
                'message' => 'Cập nhật quyền thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật quyền',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $permission = Permission::findOrFail($id);
            $roles = Role::whereHas('permissions', function ($query) use ($id) {
                $query->where('id', $id);
            })->get();

            if ($roles->isNotEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa quyền vì nó đang được sử dụng bởi vai trò khác',
                ], 400);
            }

            $permission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa quyền thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa quyền',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAll()
    {
        return response()->json([
            'success' => true,
            'data' => Permission::all(),
            'message' => 'Lấy danh sách quyền thành công',
        ], 200);
    }
}
