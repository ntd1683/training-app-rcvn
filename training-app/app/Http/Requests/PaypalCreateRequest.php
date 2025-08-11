<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaypalCreateRequest extends FormRequest
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
            'products' => 'required|array',
            'products.*.id' => 'required|string|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'ward' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'post_code' => 'nullable|string|max:20',
            'note' => 'nullable|string|max:500',
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
            'products.required' => 'Danh sách sản phẩm là bắt buộc.',
            'products.array' => 'Danh sách sản phẩm phải là một mảng.',
            'products.*.id.required' => 'ID sản phẩm là bắt buộc.',
            'products.*.id.string' => 'ID sản phẩm phải là chuỗi.',
            'products.*.id.exists' => 'Sản phẩm không tồn tại.',
            'products.*.quantity.required' => 'Số lượng sản phẩm là bắt buộc.',
            'products.*.quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
            'products.*.quantity.min' => 'Số lượng sản phẩm phải lớn hơn hoặc bằng 1.',
            'name.required' => 'Tên người nhận là bắt buộc.',
            'name.string' => 'Tên người nhận phải là chuỗi.',
            'name.max' => 'Tên người nhận không được vượt quá 255 ký tự.',
            'phone.required' => 'Số điện thoại là bắt buộc.',
            'phone.string' => 'Số điện thoại phải là chuỗi.',
            'phone.max' => 'Số điện thoại không được vượt quá 15 ký tự.',
            'address.required' => 'Địa chỉ là bắt buộc.',
            'address.string' => 'Địa chỉ phải là chuỗi.',
            'address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            'ward.required' => 'Phường/xã là bắt buộc.',
            'ward.string' => 'Phường/xã phải là chuỗi.',
            'ward.max' => 'Phường/xã không được vượt quá 255 ký tự.',
            'province.required' => 'Tỉnh/Thành phố là bắt buộc.',
            'province.string' => 'Tỉnh/Thành phố phải là chuỗi.',
            'province.max' => 'Tỉnh/Thành phố không được vượt quá 255 ký tự.',
            'post_code.string' => 'Mã bưu điện phải là chuỗi.',
            'post_code.max' => 'Mã bưu điện không được vượt quá 20 ký tự.',
            'note.string' => 'Ghi chú phải là chuỗi.',
            'note.max' => 'Ghi chú không được vượt quá 500 ký tự.'
        ];
    }
}
