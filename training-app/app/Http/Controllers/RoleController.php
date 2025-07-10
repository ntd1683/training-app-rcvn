<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleCreateRequest;
use App\Http\Requests\RoleSearchRequest;
use App\Http\Requests\RoleUpdateRequest;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(RoleSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $query = Role::with(['permissions' => function ($query) {
                $query->select('id', 'name');
            }]);

            $query->select(
                ['id', 'name', 'guard_name',
                    DB::raw('(SELECT COUNT(*) FROM model_has_roles WHERE role_id = roles.id) as users_count')
                ]);

            if (!empty($validated['name'])) {
                $query->where('name', 'like', '%' . $validated['name'] . '%');
            }

            if (!empty($validated['permissions'])) {
                $query->whereHas('permissions', function ($query) use ($validated) {
                    $query->whereIn('name', $validated['permissions']);
                });
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
            $roles = $query->paginate($perPage, ['*'], 'page', $currentPage);

            return response()->json([
                'success' => true,
                'data' => $roles->items(),
                'pagination' => [
                    'current_page' => $roles->currentPage(),
                    'per_page' => $roles->perPage(),
                    'total' => $roles->total(),
                    'last_page' => $roles->lastPage(),
                    'from' => $roles->firstItem(),
                    'to' => $roles->lastItem(),
                    'has_next_page' => $roles->hasMorePages(),
                    'has_prev_page' => $roles->currentPage() > 1,
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

    public function store(RoleCreateRequest $request)
    {
        try {
            DB::beginTransaction();
            $validated = $request->validated();
            $role = Role::create(['name' => $validated['name']]);
            \Log::info('Role created', $role->toArray());

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $role,
                'message' => 'Tạo vai trò thành công',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo vai trò',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function edit($name)
    {
    try {
            $role = Role::where('name', $name)->firstOrFail();
            $role->load('permissions:id,name');

            return response()->json([
                'success' => true,
                'data' => $role,
                'message' => 'Lấy thông tin vai trò thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin vai trò',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function Update(RoleUpdateRequest $request, $role)
    {
        try {
            DB::beginTransaction();
            $validated = $request->validated();
            $role = Role::where('name', $role)->firstOrFail();
            $role->name = $validated['name'];
            $role->save();

            if (!empty($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }
            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $role,
                'message' => 'Cập nhật vai trò thành công',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật vai trò',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($role)
    {
        try {
            $role = Role::where('name', $role)->firstOrFail();
            $usersWithRole = $role->users()->count();

            if ($usersWithRole > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa vai trò vì có người dùng đang sử dụng',
                ], 400);
            }

            $role->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa vai trò thành công',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa vai trò',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAll()
    {
        return response()->json([
            'success' => true,
            'data' => Role::all(),
            'message' => 'Lấy danh sách vai trò thành công',
        ], 200);
    }
}

