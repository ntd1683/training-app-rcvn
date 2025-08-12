<?php

namespace App\Models;

use App\Enums\OrderStatusEnum;
use App\Enums\ProductStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, SoftDeletes, Searchable;

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
     * @return HasOne
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

    /**
     * Get the OrderDetails for the product.
     *
     * @return string|null
     */
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'product_id');
    }

    /**
     * Scope a query to include the sold count of products.
     *
     * This scope calculates the total quantity sold for each product
     * by summing the quantity from order details where the order status is completed.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
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

    public function searchableAs(): string
    {
        return 'products_index';
    }

    public function toSearchableArray(): array
    {
        $array = $this->toArray();

        $array['image_url'] = $this->image_url;

        $this->loadSum(['orderDetails as sold_count' => function ($query) {
            $query->whereHas('order', function ($subQuery) {
                $subQuery->where('status', OrderStatusEnum::COMPLETED);
            });
        }], 'quantity');
        $array['sold_count'] = $this->sold_count ?? 0;

        unset($array['deleted_at'], $array['image_id']);
        return $array;
    }

    /**
     * Determine if the model should be searchable.
     */
    public function shouldBeSearchable()
    {
        return $this->status !== ProductStatusEnum::STOPPED;
    }
}
