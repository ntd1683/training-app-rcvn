<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderDetailsTableSeeder extends Seeder
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
        $products = Product::all();

        foreach ($orders as $order) {
            foreach (range(1, 50) as $index) {
                OrderDetail::create([
                    'id' => $faker->uuid,
                    'order_id' => $order->id,
                    'product_id' => $products->random()->id,
                    'price' => $faker->randomFloat(2, 10, 100),
                ]);
            }
        }
    }
}
