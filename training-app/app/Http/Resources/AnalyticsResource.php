<?php

namespace App\Http\Resources;

class AnalyticsResource extends BaseApiResource
{
    /**
     * Message for the response.
     *
     * @var string
     */
    protected string $message = 'Lấy thông tin thống kê thành công';

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

        return parent::toArray($request);
    }
}
