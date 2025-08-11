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
                'card_token' => $faker->uuid,
                'last_four_digits' => $faker->randomNumber(4),
                'expiry_date' => $faker->dateTimeBetween('now', '+3 years')->format('Y-m-d'),
                'card_type' => $faker->randomElement(['Visa', 'MasterCard', 'JCB']),
                'is_default' => $index === 1,
            ]);
        }
    }
}
