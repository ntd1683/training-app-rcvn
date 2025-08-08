<?php

namespace App\Repositories;

use App\Models\Banner;
use Prettus\Repository\Eloquent\BaseRepository;

/**
 * Class BannerRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class BannerRepositoryEloquent extends BaseRepository implements BannerRepository
{
    /**
     * Specify Model class name
     * @return string
     */
    public function model()
    {
        return Banner::class;
    }

    /**
     * Boot up the repository, pushing criteria
     * @return void
     */
    public function boot()
    {
    }
}
