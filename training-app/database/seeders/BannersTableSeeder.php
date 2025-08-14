<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BannersTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('vi_VN');
        $products = Product::all();

        for ($i = 0; $i < 10; $i++) {
            Banner::create([
                'title' => $faker->sentence,
                'subtitle' => $faker->optional()->sentence,
                'header' => $faker->optional()->sentence,
                'title_price' => $faker->optional()->randomFloat(2, 10, 1000),
                'price' => $faker->optional()->randomFloat(2, 10, 1000),
                'button_text' => $faker->optional()->word,
                'button_url' => $faker->optional()->url,
                'type' => $faker->optional()->numberBetween(1, 4),
                'user_id' => 101,
                'product_id' => $products->random()->id,
                'image_id' => null,
                'index' => $faker->optional()->numberBetween(1, 100),
            ]);
        }
    }
}
