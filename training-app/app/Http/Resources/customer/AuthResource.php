<?php

namespace App\Http\Resources\customer;

use App\Http\Resources\BaseApiResource;

class AuthResource extends BaseApiResource
{
    /**
     * Message for the response.
     *
     * @var string
     */
    protected string $message = 'Lấy thông tin người dùng thành công';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        \Log::info('AuthResource toArray called', [
            'resource' => $this->resource,
        ]);
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id' => $this->resource['id'] ?? null,
            'name' => $this->resource['name'] ?? '',
            'email' => $this->resource['email'] ?? '',
            'last_login_at' => $this->resource['last_login_at'] ?? '',
            'token' => $this->resource['token'] ?? '',
            'email_verified_at' => $this->resource['email_verified_at'] ?? null,
            'total_products' => $this->resource['total_products'] ?? 0,
            'total_price' => $this->resource['total_price'] ?? 0,
        ];
    }
}
