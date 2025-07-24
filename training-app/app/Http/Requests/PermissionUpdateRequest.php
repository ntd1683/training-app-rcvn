<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PermissionUpdateRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:permissions,name,' . $this->route('id') . '|not_regex:/<.*?>/',
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
            'name.required' => 'Tên quyền là bắt buộc.',
            'name.string' => 'Tên quyền phải là chuỗi.',
            'name.max' => 'Tên quyền không được vượt quá 255 ký tự.',
            'name.unique' => 'Tên quyền đã tồn tại.',
            'name.not_regex' => 'Tên quyền không được chứa ký tự đặc biệt.',
        ];
    }
}
