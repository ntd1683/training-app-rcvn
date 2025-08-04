<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $alphabets = range('A', 'Z');
        $users = [];
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 100; $i++) {
            $index = $i % 26;
            $extraIndex = floor($i / 26);

            $namePart = '';
            if ($extraIndex > 0) {
                $namePart = $alphabets[$extraIndex - 1];
            }
            $namePart .= $alphabets[$index];

            $fullName = "Nguyễn Văn {$namePart}";
            $namePart = strtolower($namePart);
            $email = "{$namePart}.nguyen@gmail.com";

            $users[] = [
                'name' => $fullName,
                'email' => $email,
                'password' => Hash::make('password'),
                'email_verified_at' => $faker->boolean(90) ? now() : null,
                'last_login_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'last_login_ip' => $faker->ipv4,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('customers')->insert($users);
    }
}
