<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
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
                'verify_email' => $faker->uuid,
                'is_active' => $faker->boolean(90),
                'is_delete' => $faker->boolean(10),
                'group_role' => $faker->randomElement(['Admin', 'Editor', 'Reviewer']),
                'last_login_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'last_login_ip' => $faker->ipv4,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('mst_users')->insert($users);
    }
}
