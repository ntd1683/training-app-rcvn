<?php

namespace App\Http\Requests\Admin;

use App\Enums\OrderStatusEnum;
use Illuminate\Foundation\Http\FormRequest;

class OrderUpdateRequest extends FormRequest
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
        $arrayStatus = OrderStatusEnum::allValues();
        return [
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:15',
            'recipient_address' => 'required|string|max:255',
            'recipient_ward' => 'required|string|max:255',
            'recipient_province' => 'required|string|max:255',
            'post_code' => 'nullable|string|max:20',
            'note' => 'nullable|string|max:500',
            'status' => 'required|integer|in:' . implode(',', $arrayStatus),
        ];
    }

    public function messages()
    {
        return [
            'recipient_name.required' => 'Tên người nhận là bắt buộc.',
            'recipient_name.string' => 'Tên người nhận phải là chuỗi.',
            'recipient_name.max' => 'Tên người nhận không được vượt quá 255 ký tự.',
            'recipient_phone.required' => 'Số điện thoại là bắt buộc.',
            'recipient_phone.string' => 'Số điện thoại phải là chuỗi.',
            'recipient_phone.max' => 'Số điện thoại không được vượt quá 15 ký tự.',
            'recipient_address.required' => 'Địa chỉ là bắt buộc.',
            'recipient_address.string' => 'Địa chỉ phải là chuỗi.',
            'recipient_address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
            'recipient_ward.required' => 'Phường/Xã là bắt buộc.',
            'recipient_ward.string' => 'Phường/Xã phải là chuỗi.',
            'recipient_ward.max' => 'Phường/Xã không được vượt quá 255 ký tự.',
            'recipient_province.required' => 'Tỉnh/Thành phố là bắt buộc.',
            'recipient_province.string' => 'Tỉnh/Thành phố phải là chuỗi.',
            'recipient_province.max' => 'Tỉnh/Thành phố không được vượt quá 255 ký tự.',
            'post_code.string' => 'Mã bưu điện phải là chuỗi.',
            'post_code.max' => 'Mã bưu điện không được vượt quá 20 ký tự.',
            'note.string' => 'Ghi chú phải là chuỗi.',
            'note.max' => 'Ghi chú không được vượt quá 500 ký tự.',
            'status.required' => 'Trạng thái đơn hàng là bắt buộc.',
            'status.integer' => 'Trạng thái đơn hàng phải là số nguyên.',
            'status.in' => 'Trạng thái đơn hàng không hợp lệ.',
        ];
    }
}
