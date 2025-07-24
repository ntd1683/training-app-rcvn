<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductCreateRequest extends FormRequest
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
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'currency' => 'required|string|max:10',
            'status' => 'required|integer|in:0,1,2',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:20480|dimensions:max_width:1024,max_height:1024',
            'is_delete' => 'nullable|integer|in:0',
        ];
    }
}
