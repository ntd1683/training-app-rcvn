<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;

abstract class BaseApiResource extends JsonResource
{
    /**
     * Default message for the response.
     *
     * @var string
     */
    protected string $message = 'Thành công';

    /**
     * Common error codes and messages.
     */
    protected const ERROR_CODES = [
        400 => ['code' => 400, 'message' => 'Yêu cầu không hợp lệ'],
        404 => ['code' => 404, 'message' => 'Không tìm thấy tài nguyên'],
        422 => ['code' => 422, 'message' => 'Dữ liệu không hợp lệ'],
        401 => ['code' => 401, 'message' => 'Không có quyền truy cập'],
        403 => ['code' => 403, 'message' => 'Truy cập bị cấm'],
        500 => ['code' => 500, 'message' => 'Lỗi máy chủ'],
        'NOT_FOUND' => ['code' => 404, 'message' => 'Không tìm thấy tài nguyên'],
        'VALIDATION_FAILED' => ['code' => 422, 'message' => 'Dữ liệu không hợp lệ'],
        'UNAUTHORIZED' => ['code' => 401, 'message' => 'Không có quyền truy cập'],
        'FORBIDDEN' => ['code' => 403, 'message' => 'Truy cập bị cấm'],
        'SERVER_ERROR' => ['code' => 500, 'message' => 'Lỗi máy chủ'],
    ];

    /**
     * Common success message.
     */
    protected const SUCCESS_CODES = [
        'OK' => ['code' => 200, 'message' => 'Yêu cầu thành công'],
        'CREATED' => ['code' => 201, 'message' => 'Tài nguyên đã được tạo thành công'],
    ];

    /**
     * Create a new resource instance.
     *
     * @param mixed $resource
     * @param string|null $message
     * @param string|int|null $successKey
     * @return void
     */
    public function __construct($resource, ?string $message = null, $successKey = 'OK')
    {
        parent::__construct($resource);
        $this->message = $message ?? $this->message;
        $this->successKey = $successKey;
    }

    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }

    /**
     * Return a success JSON response.
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function toResponse($request)
    {
        return $this->successResponse($this->toArray($request));
    }

    /**
     * Create a success JSON response.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @param string $successKey
     * @return JsonResponse
     */
    protected function successResponse($data = null, ?string $message = null, string $successKey = 'OK'): JsonResponse
    {
        $success = self::SUCCESS_CODES[$successKey] ?? self::SUCCESS_CODES['OK'];
        $message = $message ?? $success['message'];

        $response = [
            'success' => true,
            'message' => $message,
        ];

        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, $success['code'])->header('Content-Type', 'application/json');
    }

    /**
     * Create an error JSON response with predefined error code.
     *
     * @param string $errorKey
     * @param mixed $errors
     * @param string|null $customMessage
     * @return JsonResponse
     */
    public function errorResponse(string $errorKey, $errors = null, ?string $customMessage = null): JsonResponse
    {
        $error = self::ERROR_CODES[$errorKey] ?? self::ERROR_CODES['SERVER_ERROR'];
        $message = $customMessage ?? $error['message'];

        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (!is_null($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $error['code'])->header('Content-Type', 'application/json');
    }
}
