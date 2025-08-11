<?php

namespace App\Repositories;

use App\Models\Image;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class ImageRepositoryEloquent
 * Eloquent implementation of User repository.
 */
class ImageRepositoryEloquent extends BaseRepository implements ImageRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Image::class;
    }

    /**
     * Boot up the repository, pushing criteria
     *
     * @return void
     */
    public function boot()
    {
    }
}
