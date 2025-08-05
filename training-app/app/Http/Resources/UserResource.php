<?php

namespace App\Http\Resources;

class UserResource extends BaseApiResource
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
     * @param  \Illuminate\Http\Request $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'group_role' => $this->group_role,
            'is_active' => $this->is_active,
            'is_delete' => $this->is_delete,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
