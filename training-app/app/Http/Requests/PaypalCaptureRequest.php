<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaypalCaptureRequest extends FormRequest
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
            'order_id' => '|string|exists:orders,paypal_order_id',
        ];
    }

    public function messages()
    {
        return [
            'order_id.required' => 'ID đơn hàng là bắt buộc.',
            'order_id.string' => 'ID đơn hàng phải là chuỗi.',
            'order_id.exists' => 'Đơn hàng không tồn tại.',
            'paypal_order_id.required' => 'ID đơn hàng PayPal là bắt buộc.',
            'paypal_order_id.string' => 'ID đơn hàng PayPal phải là chuỗi.',
            'paypal_order_id.exists' => 'Đơn hàng PayPal không tồn tại.',
        ];
    }
}
