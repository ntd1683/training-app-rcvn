<?php

namespace App\Models;

use App\Enums\OrderStatusEnum;
use App\Notifications\CustomVerifyEmail;
use App\Notifications\PasswordResetMail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Customer extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected string $guard_name = 'customer';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'last_login_at',
        'last_login_ip',
        'provider_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'verify_email',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [];

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomVerifyEmail);
    }

    /**
     * Send notification reset password.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordResetMail($token));
    }

    /**
     * Get the total order completed
     *
     * @return int
     */
    public function getTotalOrdersAttribute(): int
    {
        return $this->orders()
            ->where('status', OrderStatusEnum::COMPLETED)
            ->count();
    }

    /**
     * Scope a query to include the total orders of customer.
     *
     * This scope calculates the total order where order complete.
     *
     * @param  Builder  $query
     * @return Builder
     */
    public function scopeWithTotalOrders($query)
    {
        return $query->withCount(['orders as total_orders' => function ($query) {
            $query->where('status', OrderStatusEnum::COMPLETED);
        }]);
    }

    /**
     * Get the total spent order placed
     *
     * @return float
     */
    public function getTotalSpentAttribute(): float
    {
        return $this->orders()
            ->where('status', OrderStatusEnum::COMPLETED)
            ->sum('total_amount');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'customer_id');
    }
}
