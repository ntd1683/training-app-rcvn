<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $checkPermission = $this->user()->hasRole('Admin') || $this->user()->can('permissions.index');
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
            'name' => 'string|nullable',
            'sort_by' => 'string|nullable|in:id,name,roles_count',
            'sort_order' => 'string|nullable|in:asc,desc',
            'selected' => 'array|nullable',
            'selected.*' => 'string|distinct|exists:permissions,id',
        ];
    }
}
