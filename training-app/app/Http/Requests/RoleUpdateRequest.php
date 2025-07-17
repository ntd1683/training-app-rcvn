<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $checkPermission = $this->user()->hasRole('Admin')
            || $this->user()->hasRole('SuperAdmin')
            || $this->user()->can('roles.update');
        return auth('sanctum')->check() && $checkPermission;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:50|
            unique:roles,name,' . $this->route('role') . ',name|
            not_regex:/[\\/]/|not_regex:/<.*?>/',
            'permissions' => 'array|nullable',
            'permissions.*' => 'string|distinct|exists:permissions,name',
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
            'name.required' => 'Tên vai trò là bắt buộc.',
            'name.unique' => 'Tên vai trò đã tồn tại.',
            'name.*' => 'Tên vai trò không hợp lệ',
            'permissions.*' => 'Quyền không hợp lệ hoặc không tồn tại.',
        ];
    }
}
