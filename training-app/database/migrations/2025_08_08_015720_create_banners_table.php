<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('header')->nullable();
            $table->string('title_price')->nullable();
            $table->decimal('price', 15, 2)->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->integer('type')->nullable();
            $table->string('product_id')->nullable();
            $table->unsignedBigInteger('image_id')->nullable();
            $table->integer('index')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('image_id')->references('id')->on('images')->onDelete('set null');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('mst_users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('banners');
    }
};
