<?php

namespace Database\Seeders;

use App\Enums\PaymentStatusEnum;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentTransactionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create('vi_VN');
        $orders = Order::all();
        $paymentStatus = PaymentStatusEnum::allValues();

        foreach (range(1, 50) as $index) {
            $order = $orders->random();
            $customer = $order->customer;
            if ($customer->payments->isEmpty()) {
                continue;
            }
            $payment = $customer->payments->random();
            PaymentTransaction::create([
                'payer_id' => $faker->uuid,
                'order_id' => $order->id,
                'payment_id' => $payment->id,
                'payer_email' => $faker->email,
                'amount' => $order->total_amount,
                'currency' => 'VND',
                'payment_status' => $faker->randomElement($paymentStatus),
                'payment_method' => 'paypal',
                'payment_time' => $faker->dateTimeThisMonth,
                'response_data' => json_encode(['transaction_id' => $faker->uuid]),
            ]);
        }
    }
}
