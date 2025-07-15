<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Repositories\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    protected ImageService $imageService;

    /**
     * ImageController constructor.
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
            return response()->json([
                'error' => 'Ảnh không tồn tại hoặc không tìm thấy',
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
