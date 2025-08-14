<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

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
        'customer_id',
        'order_code',
        'paypal_order_id',
        'total_amount',
        'payment_transaction_id',
        'status',
        'recipient_name',
        'recipient_phone',
        'recipient_address',
        'recipient_ward',
        'recipient_district',
        'recipient_province',
        'recipient_country',
        'post_code',
        'note',
    ];

    protected $appends = ['products'];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function paymentTransactions()
    {
        return $this->hasMany(PaymentTransaction::class, 'order_id');
    }

    public function orderTimeline()
    {
        return $this->hasMany(OrderTimeline::class, 'order_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }

    public function products()
    {
        return $this->hasManyThrough(
            Product::class,
            OrderDetail::class,
            'order_id',
            'id',
            'id',
            'product_id'
        );
    }

    public function getProductsAttribute()
    {
        return $this->orderDetails->map(function ($detail) {
            $product = $detail->product;
            if ($product) {
                $productData = $product->toArray();
                unset($productData['image']);

                $productData['image_url'] = $product->image ? asset('storage/' . $product->image->path) : null;
                $productData['order_price'] = $detail->price;
                $productData['order_quantity'] = $detail->quantity;

                return $productData;
            }
            return null;
        })->filter();
    }
}
