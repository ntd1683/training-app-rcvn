<?php

namespace App\Repositories\Services;

use App\Models\Image;
use App\Repositories\Criteria\UserFilterCriteria;
use App\Repositories\ImageRepository;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use App\Enums\DefaultRoleEnum;
use Exception;
use Throwable;

/**
 * Class ImageService
 * Handles business logic for Image operations.
 */
class ImageService
{
    protected $imageRepository;

    /**
     * UserService constructor.
     * @param ImageRepository $imageRepository
     */
    public function __construct(ImageRepository $imageRepository)
    {
        $this->imageRepository = $imageRepository;
    }

    /**
     * Get all images
     * @return Collection
     */
    public function getAllImages()
    {
        return $this->imageRepository->all();
    }

    /**
     * Find an image by ID
     * @param int $id
     * @return Model|null
     * @throws Exception
     */
    public function getImageById($id)
    {
        $image = $this->imageRepository->find($id);
        if (!$image) {
            throw new Exception('Không tìm thấy ảnh', 404);
        }

        return $image;
    }

    /**
     * Find an image by filename
     * @param string $filename
     * @return Model|null
     * @throws Exception
     */
    public function getImageByFileName($filename)
    {
        $image = $this->imageRepository->find($filename, 'filename');
        if (!$image) {
            throw new Exception('Không tìm thấy ảnh', 404);
        }

        return $image;
    }

    /**
     * Get image file by filename
     * @param string $filename
     * @return array
     * @throws Exception
     */
    public function getImageFileByFileName(string $filename)
    {
        $imageRecord = Cache::remember("image_{$filename}", 3600, function () use ($filename) {
            return Image::where('filename', $filename)->first();
        });

        if (!$imageRecord) {
            throw new Exception('Không tìm thấy ảnh', 404);
        }

        if (!Storage::disk('public')->exists($imageRecord->path)) {
            throw new Exception('Không tìm thấy file ảnh', 404);
        }

        return [
            'file_contents' => Storage::disk('public')->get($imageRecord->path),
            'mime_type' => $imageRecord->mime_type,
            'original_name' => $imageRecord->original_name,
        ];
    }

    /**
     * Create a new image
     * @param UploadedFile $image
     * @param int $userId
     * @return Model
     * @throws Exception|Throwable
     */
    public function createImage($image, $userId)
    {
        if (!$image->isValid()) {
            throw new Exception('Ảnh không hợp lệ', 422);
        }

        $hash = hash_file('sha256', $image->getRealPath());
        $extension = $image->getClientOriginalExtension();
        $filename = $hash . '.' . $extension;
        $path = $image->storeAs(
            "uploads/images/products/" . date('Y.m.d'),
            $filename,
            'public'
        );
        $originalName = sanitizeFilename($image->getClientOriginalName());
        $mimeType = $image->getMimeType();
        $data = [
            'filename' => $filename,
            'original_name' => $originalName,
            'path' => $path,
            'size' => $image->getSize(),
            'mime_type' => $mimeType,
            'user_id' => $userId,
        ];

        DB::beginTransaction();
        try {
            $image = $this->imageRepository->create($data);
            DB::commit();
            return $image;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an image
     * @param string $filename
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function updateImage(string $filename, array $data)
    {
        $image = $this->imageRepository->find($filename, 'filename');
        if (!$image) {
            throw new Exception('Không tìm thấy ảnh', 404);
        }

        DB::beginTransaction();
        try {
            $updatedImage = $this->imageRepository->update($data, $image->id);
            DB::commit();
            return $updatedImage;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete an image
     * @param int $id
     * @return bool
     * @throws Exception
     */
    public function deleteImage($id)
    {
        $image = $this->imageRepository->find($id);

        if (!$image) {
            throw new Exception('Không tìm thấy ảnh', 404);
        }

        Storage::disk('public')->delete($image->path);

        \Log::info('Deleting image with ID: ' . $id);
        return $this->imageRepository->delete($id);
    }

    /**
     * Delete a storage image
     * @param string $path
     * @return bool
     * @throws Exception
     */
    public function deleteImageStorage($path)
    {
        $existImage = Storage::disk('public')->exists($path);
        if (!$existImage) {
            throw new Exception('Không tìm thấy ảnh', 404);
        }

        Storage::disk('public')->delete($path);
        return true;
    }
}
