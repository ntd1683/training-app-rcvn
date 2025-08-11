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

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function paymentTransactions()
    {
        return $this->hasMany(PaymentTransaction::class, 'order_id', 'id');
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
}
