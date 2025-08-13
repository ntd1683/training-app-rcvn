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
                'id'                => $faker->uuid,
                'customer_id'       => $customers->random()->id,
                'order_code'        => 'ORD-' . $faker->unique()->numberBetween(10000, 99999),
                'paypal_order_id'   => $faker->uuid,
                'total_amount'      => $faker->randomFloat(2, 100000, 5000000),
                'status'            => $faker->randomElement($status),
                'recipient_name'    => $faker->name,
                'recipient_phone'   => $faker->phoneNumber,
                'recipient_address' => $faker->streetAddress,
                'recipient_ward'    => $faker->word,
                'recipient_district'=> $faker->citySuffix,
                'recipient_province'=> $faker->city, // ví dụ: "Hà Nội"
                'recipient_country' => 'Việt Nam',
                'post_code'         => $faker->postcode,
                'note'              => $faker->optional()->sentence,
            ]);
        }
    }
}
