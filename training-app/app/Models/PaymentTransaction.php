<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentTransaction extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payer_id',
        'order_id',
        'payment_id',
        'payer_email',
        'amount',
        'currency',
        'payment_status',
        'payment_method',
        'payment_time',
        'response_data',
    ];

    public function customer()
    {
        return $this->belongsTo(Payment::class, 'payment_id')->customer();
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function paymentCard()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}
