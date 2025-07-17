<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $checkPermission = auth('sanctum')->user()->hasRole('Admin')
            || auth('sanctum')->user()->hasRole('SuperAdmin')
            || auth('sanctum')->user()->can('users.index');
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
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'search_name' => 'string|nullable',
            'search_email' => 'string|nullable',
            'filter_group' => 'string|nullable|exists:roles,name',
            'filter_status' => 'integer|nullable|in:0,1',
            'sort_by' => 'string|nullable|in:id,name,email,group_role,is_active',
            'sort_order' => 'string|nullable|in:asc,desc',
        ];
    }
}
