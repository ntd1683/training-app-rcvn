<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Repositories\Services\UserService;
use App\Http\Requests\UserSearchRequest;
use Exception;

class UserController extends Controller
{
    protected UserService $userService;

    /**
     * UserController constructor.
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(UserSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $users = $this->userService->getFilteredUsers($validated);

            return new UserCollection($users, 'Lấy danh sách users thành công');
        } catch (Exception $e) {
            return (new UserResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function store(UserCreateRequest $request)
    {
        try {
            $user = $this->userService->createUser($request->validated(), auth()->user());
            return new UserResource($user, null, 'CREATED');
        } catch (Exception $e) {
            return (new UserResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function edit($id)
    {
        try {
            $user = $this->userService->getUserById($id);
            return new UserResource($user);
        } catch (Exception $e) {
            return (new UserResource(null))->errorResponse(
                'NOT_FOUND',
                null,
                'Không tìm thấy user hoặc có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function update(UserUpdateRequest $request, $id)
    {
        try {
            $user = $this->userService->updateUser($id, $request->validated(), auth()->user());
            return new UserResource($user, 'Cập nhật thành viên thành công');
        } catch (Exception $e) {
            return (new UserResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function destroy($id)
    {
        try {
            $this->userService->deleteUser($id, auth()->user());
            return new UserResource(null, 'Xóa thành viên thành công');
        } catch (Exception $e) {
            return (new UserResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function toggleStatus($id)
    {
        try {
            $user = $this->userService->toggleUserStatus($id);
            return new UserResource($user, 'Thay đổi trạng thái thành công');
        } catch (Exception $e) {
            return (new UserResource(null))->errorResponse(
                'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
