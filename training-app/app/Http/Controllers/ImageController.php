<?php

namespace App\Http\Controllers;

use App\Repositories\Services\ImageService;

class ImageController extends Controller
{
    protected ImageService $imageService;

    /**
     * ImageController constructor.
     *
     * @param ImageService $imageService
     */
    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function show($image)
    {
        try {
            $imageInfoContent = $this->imageService->getImageFileByFileName($image);

            return response($imageInfoContent['file_contents'], 200)
                ->header('Content-Type', $imageInfoContent['mime_type'])
                ->header('Cache-Control', 'public, max-age=86400') // 24h cache
                ->header('ETag', md5($imageInfoContent['file_contents']))
                ->header('Access-Control-Allow-Origin', config('app.frontend_url'))
                ->header('Content-Disposition', 'inline; filename="' . $imageInfoContent['original_name'] . '"');
        } catch (\Exception $e) {
            return response()->json(
                [
                'error' => 'Ảnh không tồn tại hoặc không tìm thấy',
                'message' => $e->getMessage(),
                ], 404
            );
        }
    }
}
