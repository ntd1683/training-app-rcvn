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
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('card_token');
            $table->dropColumn('last_four_digits');
            $table->dropColumn('expiry_date');
            $table->dropColumn('card_type');
            $table->string('payment_method_token')->nullable()->after('customer_id');
            $table->string('payment_method_type')->nullable()->after('payment_method_token');
            $table->string('status')->default('active')->after('payment_method_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('payment_method_token');
            $table->dropColumn('payment_method_type');
            $table->dropColumn('status');
            $table->string('card_token')->unique();
            $table->string('last_four_digits');
            $table->date('expiry_date');
            $table->string('card_type');
        });
    }
};
