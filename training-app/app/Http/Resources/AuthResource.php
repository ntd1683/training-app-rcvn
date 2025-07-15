<?php

namespace App\Http\Resources;

class AuthResource extends BaseApiResource
{
    /**
     * Message for the response.
     *
     * @var string
     */
    protected string $message = 'Lấy thông tin user thành công';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id' => $this->resource['id'] ?? null,
            'name' => $this->resource['name'] ?? '',
            'email' => $this->resource['email'] ?? '',
            'group_role' => $this->resource['group_role'] ?? '',
            'is_active' => $this->resource['is_active'] ?? '',
            'permissions' => $this->resource['permissions'] ?? [],
            'last_login_at' => $this->resource['last_login_at'] ?? '',
            'token' => $this->resource['token'] ?? '',
        ];
    }
}
