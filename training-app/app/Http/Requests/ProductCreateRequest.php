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
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:10',
            'status' => 'required|integer|in:0,1,2',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048|dimensions:max_width:1024,max_height:1024',
            'is_delete' => 'nullable|integer|in:0',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'name.string' => 'Tên sản phẩm phải là chuỗi.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'description.string' => 'Mô tả sản phẩm phải là chuỗi.',
            'price.required' => 'Giá sản phẩm là bắt buộc.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm phải lớn hơn hoặc bằng 0.',
            'currency.required' => 'Tiền tệ là bắt buộc.',
            'currency.string' => 'Tiền tệ phải là chuỗi.',
            'currency.max' => 'Tiền tệ không được vượt quá 10 ký tự.',
            'status.required' => 'Trạng thái sản phẩm là bắt buộc.',
            'status.integer' => 'Trạng thái sản phẩm phải là số nguyên.',
            'status.in' => 'Trạng thái sản phẩm không hợp lệ. Giá trị hợp lệ là 0, 1 hoặc 2.',
            'image.image' => 'Ảnh sản phẩm phải là một tệp hình ảnh.',
            'image.mimes' => 'Ảnh sản phẩm phải có định dạng jpeg, png hoặc jpg.',
            'image.max' => 'Ảnh sản phẩm không được vượt quá 2mb.',
        ];
    }
}
