<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class BaseCollection extends ResourceCollection
{
    protected string $message = 'Lấy danh sách thành công';

    /**
     * Create a new collection instance.
     *
     * @param  mixed  $resource
     * @param  string|null  $message
     * @return void
     */
    public function __construct($resource, ?string $message = null)
    {
        parent::__construct($resource);
        $this->message = $message ?? $this->message;
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $pagination = [];

        if ($this->resource instanceof LengthAwarePaginator) {
            $pagination = [
                'current_page' => $this->resource->currentPage(),
                'per_page' => $this->resource->perPage(),
                'total' => $this->resource->total(),
                'last_page' => $this->resource->lastPage(),
                'from' => $this->resource->firstItem(),
                'to' => $this->resource->lastItem(),
                'has_next_page' => $this->resource->hasMorePages(),
                'has_prev_page' => $this->resource->currentPage() > 1,
            ];
        }

        return [
            'success' => true,
            'data' => $this->collection,
            'pagination' => $pagination,
            'message' => $this->message,
            'meta' => [
                'timestamp' => now()->toDateTimeString(),
                'path' => $request->path(),
            ],
        ];
    }
}
