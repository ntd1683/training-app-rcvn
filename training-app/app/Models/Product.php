<?php

namespace App\Models;

use App\Enums\OrderStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'currency',
        'status',
        'user_id',
        'image_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'image_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array<string>
     */
    public function image()
    {
        return $this->hasOne(Image::class, 'id', 'image_id');
    }

    /**
     * Get the image URL for the product.
     *
     * @return string|null
     */
    public function getImageUrlAttribute()
    {
        if ($this->image_id && $this->image) {
            return asset('storage/' . $this->image->path);
        }
        return null;
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'product_id');
    }

    public function scopeWithSoldCount($query)
    {
        return $query->withSum([
            'orderDetails as sold_count' => function ($query) {
                $query->whereHas('order', function ($subQuery) {
                    $subQuery->where('status', OrderStatusEnum::COMPLETED);
                });
            }
        ], 'quantity');
    }
}
