<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayCallbackRequest extends FormRequest
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
            'order_id' => 'required|string|exists:orders,id',
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
            'order_id.required' => 'Order ID is required.',
            'order_id.string' => 'Order ID must be a string.',
            'order_id.exists' => 'The specified order does not exist.',
        ];
    }
}
