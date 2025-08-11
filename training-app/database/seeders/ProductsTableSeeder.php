<?php

namespace Database\Seeders;

use App\Enums\ProductStatusEnum;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('vi_VN');
        $users = User::all()->pluck('id')->toArray();

        for ($i = 0; $i < 100; $i++) {
            $name = ucfirst($faker->word) . ' ' . $faker->word;
            $number = str_pad($i + 1, 9, '0', STR_PAD_LEFT);
            $id = $name[0] . $number;
            $products[] = [
                'id' => $id,
                'name' => $name,
                'description' => $faker->paragraph,
                'price' => $faker->numberBetween(1, 100),
                'currency' => 'USD',
                'status' => $faker->randomElement([
                    ProductStatusEnum::STOPPED->value,
                    ProductStatusEnum::SELLING->value,
                    ProductStatusEnum::OUT_OF_STOCK->value,
                ]),
                'deleted_at' => $faker->boolean(10) ? now() : null,
                'user_id' => $faker->randomElement($users),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('products')->insert($products);
    }
}
