<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentsTableSeeder extends Seeder
{
    public function run()
    {
        $faker = \Faker\Factory::create('vi_VN');
        $customers = Customer::all();

        foreach (range(1, 50) as $index) {
            Payment::create([
                'customer_id' => $customers->random()->id,
                'payment_method_token' => $faker->uuid,
                'payment_method_type' => $faker->randomElement(['credit_card', 'paypal', 'bank_transfer']),
                'status' => $faker->randomElement(['fail', 'active', 'inactive']),
                'is_default' => $index === 1,
            ]);
        }
    }
}
