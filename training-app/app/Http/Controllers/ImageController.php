<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function show($image)
    {
        // Cache query để tăng hiệu suất
        $imageRecord = Cache::remember("image_{$image}", 3600, function() use ($image) {
            return Image::where('filename', $image)->first();
        });

        if (!$imageRecord) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        // Kiểm tra file tồn tại
        if (!Storage::disk('public')->exists($imageRecord->path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $fileContents = Storage::disk('public')->get($imageRecord->path);

        return response($fileContents, 200)
            ->header('Content-Type', $imageRecord->mime_type)
            ->header('Cache-Control', 'public, max-age=86400') // 24h cache
            ->header('ETag', md5($fileContents))
            ->header('Access-Control-Allow-Origin', config('app.frontend_url'))
            ->header('Content-Disposition', 'inline; filename="' . $imageRecord->original_name . '"');
    }
}
