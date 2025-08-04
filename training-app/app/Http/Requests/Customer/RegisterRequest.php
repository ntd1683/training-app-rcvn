<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:customers,email',
            'password' => 'required|string|min:4',
            're_password' => 'required|string|min:4|same:password',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'name.required' => 'Tên đầy đủ là bắt buộc',
            'name.string' => 'Tên đầy đủ phải là một chuỗi.',
            'name.max' => 'Tên đầy đủ không được vượt quá 255 ký tự.',
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email phải là một địa chỉ email hợp lệ.',
            'email.max' => 'Email không được vượt quá 255 ký tự.',
            'email.unique' => 'Email đã được sử dụng. Vui lòng chọn email khác.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.string' => 'Mật khẩu phải là một chuỗi.',
            'password.min' => 'Mật khẩu phải có ít nhất 4 ký tự.',
            're_password.required' => 'Mật khẩu xác nhận là bắt buộc.',
            're_password.string' => 'Mật khẩu xác nhận phải là một chuỗi.',
            're_password.min' => 'Mật khẩu xác nhận phải có ít nhất 4 ký tự.',
            're_password.same' => 'Mật khẩu xác nhận phải khớp với mật khẩu đã nhập.',
        ];
    }
}
