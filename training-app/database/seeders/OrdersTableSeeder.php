<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use App\Models\Customer;
use App\Models\Order;
use App\Models\PaymentTransaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create('vi_VN');
        $customers = Customer::all();
        $status = OrderStatusEnum::allValues();

        foreach (range(1, 50) as $index) {
            Order::create([
                'id' => $faker->uuid,
                'customer_id' => $customers->random()->id,
                'order_code' => 'ORD-' . $faker->unique()->randomNumber(5),
                'total_amount' => $faker->randomFloat(2, 100, 1000),
                'status' => $faker->randomElement($status),
            ]);
        }
    }
}
