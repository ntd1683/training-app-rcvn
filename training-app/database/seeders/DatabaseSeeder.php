<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Faker\Factory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UsersTableSeeder::class,
            ProductsTableSeeder::class,
            RoleAndPermissionTableSeeder::class,
            CreateAccountSupperAdminSeeder::class,
            CreateRoleUserSeeder::class,
            CustomersTableSeeder::class,
            PaymentsTableSeeder::class,
            OrdersTableSeeder::class,
            OrderDetailsTableSeeder::class,
            PaymentTransactionsTableSeeder::class,
            BannersTableSeeder::class,
        ]);
    }
}
