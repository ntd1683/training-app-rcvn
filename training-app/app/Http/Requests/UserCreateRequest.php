<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return auth('sanctum')->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|email|unique:mst_users,email',
            'password' => 'nullable|string|min:6|max:100',
            'group_role' => 'required|string|max:50|exists:roles,name',
            'is_active' => 'boolean',
            'is_delete' => 'boolean',
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'name.required' => 'Tên người dùng là bắt buộc.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'group_role.required' => 'Vai trò nhóm là bắt buộc.',
            'group_role.*' => 'Vai trò nhóm không hợp lệ.',
            'is_active.boolean' => 'Trạng thái hoạt động phải là true hoặc false.',
            'is_delete.boolean' => 'Trạng thái xóa phải là true hoặc false.',
        ];
    }
}
