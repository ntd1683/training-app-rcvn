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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('payer_id');
            $table->string('order_id');
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->string('payer_email');
            $table->decimal('amount', 10, 2);
            $table->string('currency');
            $table->tinyInteger('payment_status')->default(0);
            $table->string('payment_method');
            $table->dateTime('payment_time');
            $table->text('response_data')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('set null');
            $table->index('payer_email');
            $table->index('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payment_transactions');
    }
};
