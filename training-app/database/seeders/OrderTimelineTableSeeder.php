<?php

namespace Database\Seeders;

use App\Enums\OrderTimelineStatusEnum;
use App\Models\Banner;
use App\Models\Order;
use App\Models\OrderTimeline;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class OrderTimelineTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('vi_VN');

        $orders = Order::orderBy('created_at', 'desc')->take(10)->get();

        foreach ($orders as $order) {
            $steps = [
                ['type' => OrderTimelineStatusEnum::PENDING, 'note' => 'Lên Đơn'],
                ['type' => OrderTimelineStatusEnum::PROCESSING, 'note' => 'Đang xử lý đơn'],
                ['type' => OrderTimelineStatusEnum::PAID, 'note' => 'Thanh toán thành công'],
                ['type' => OrderTimelineStatusEnum::COMPLETED, 'note' => 'Hoàn thành đơn'],
                ['type' => OrderTimelineStatusEnum::FAILED, 'note' => 'Thanh toán thất bại'],
            ];

            $timelineCount = $faker->numberBetween(3, 5);
            $selectedSteps = collect($steps)->random($timelineCount)->values();

            $time = $faker->dateTimeBetween('-10 days', 'now');

            foreach ($selectedSteps as $step) {
                OrderTimeline::create([
                    'type'      => $step['type'],
                    'note'      => $step['note'],
                    'order_id'  => $order->id,
                    'created_at'=> $time,
                    'updated_at'=> $time,
                ]);

                // Cộng thêm 1-2 giờ cho mỗi bước tiếp theo
                $time->modify('+' . $faker->numberBetween(1, 2) . ' hours');
            }
        }
    }
}
