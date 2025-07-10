<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use App\Http\Requests\SearchUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(SearchUserRequest $request)
    {
        try {
            $validated = $request->validated();

            $query = User::query();
            $query->where('is_delete', false);
            $query->select(['id', 'name', 'email', 'group_role', 'is_active']);

            if (!empty($validated['search_name'])) {
                $query->where('name', 'like', '%' . $validated['search_name'] . '%');
            }

            if (!empty($validated['search_email'])) {
                $query->where('email', 'like', '%' . $validated['search_email'] . '%');
            }

            if (!empty($validated['filter_group'])) {
                $query->where('group_role', $validated['filter_group']);
            }

            if (isset($validated['filter_status'])) {
                $query->where('is_active', $validated['filter_status']);
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
            $users = $query->paginate($perPage, ['*'], 'page', $currentPage);

            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                    'has_next_page' => $users->hasMorePages(),
                    'has_prev_page' => $users->currentPage() > 1
                ],
                'message' => 'Lấy danh sách users thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(CreateUserRequest $request)
    {
        try {
            $validated = $request->validated();

            DB::beginTransaction();
            $validated['password'] = bcrypt($validated['password']);
            $user = User::create($validated);

            if ($user->group_role == 'Admin') {
                $user->assignRole('Admin');
            } elseif ($user->group_role == 'Editor') {
                $user->assignRole('Editor');
            } else {
                $user->assignRole('Reviewer');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Tạo user thành công'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function edit($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->select(['id', 'name', 'email', 'group_role', 'is_active', 'is_delete']);
            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Lấy thông tin user thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validated();
            DB::beginTransaction();

            if (!empty($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            } else {
                unset($validated['password']);
            }

            if (isset($validated['is_delete'])) {
                $validated['is_delete'] = false;
            }

            if (isset($validated['group_role'])) {
                $user->syncRoles($validated['group_role']);
            }

            $user->update($validated);
            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Cập nhật user thành công'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $currentUser = auth()->user();
            if($currentUser && $currentUser->id == $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không thể xóa chính mình'
                ], 403);
            }
            $user = User::findOrFail($id);
            if ($user->is_delete) {
                return response()->json([
                    'success' => false,
                    'message' => 'User đã bị xóa trước đó'
                ], 404);
            }
            $user->is_delete = true;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Xóa user thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->is_active = $user->is_active ? 0 : 1;
            $user->save();

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Thay đổi trạng thái thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
