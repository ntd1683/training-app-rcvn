<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderTimeline extends Model
{
    protected $table = 'order_timeline';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'note',
        'order_id',
    ];

    public function order()
    {
        return $this->hasOne(Order::class, 'id', 'order_id');
    }
}
