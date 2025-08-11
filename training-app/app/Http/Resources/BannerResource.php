<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use JsonSerializable;

class BannerResource extends BaseApiResource
{
    /**
     * Message for the response.
     *
     * @var string
     */
    protected string $message = 'Lấy thông tin banner thành công';

    /**
     * Transform the resource into an array.
     *
     * @param  Request $request
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        return parent::toArray($request);
    }
}
