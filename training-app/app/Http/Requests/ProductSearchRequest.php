<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductSearchRequest extends FormRequest
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
            'price_from' => 'numeric|nullable',
            'price_to' => 'numeric|nullable',
            'currency' => 'string|nullable|max:10',
            'status' => 'integer|nullable|in:0,1,2,3', // 0: STOPPED, 1: SELLING, 2: OUT_OF_STOCK, 3: BOTH
            'sort_by' => 'string|nullable|in:id,name,description,status,price,created_at,popular',
            'sort_order' => 'string|nullable|in:asc,desc',
        ];
    }
}
