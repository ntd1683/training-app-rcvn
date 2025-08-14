<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
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
            'date' => 'date|nullable',
            'status' => 'integer|nullable|in:0,1,2,3',
            'sort_by' => 'string|nullable|in:id,name,date,created_at',
            'sort_order' => 'string|nullable|in:asc,desc',
        ];
    }
}
