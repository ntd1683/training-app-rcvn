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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('recipient_name')->nullable()->after('status');
            $table->string('recipient_phone')->nullable()->after('recipient_name');
            $table->string('recipient_address')->nullable()->after('recipient_phone');
            $table->string('recipient_ward')->nullable()->after('recipient_address');
            $table->string('recipient_district')->nullable()->after('recipient_ward');
            $table->string('recipient_province')->nullable()->after('recipient_district');
            $table->string('recipient_country')->nullable()->after('recipient_province');
            $table->string('post_code')->nullable()->after('recipient_country');
            $table->string('note')->nullable()->after('post_code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('recipient_name');
            $table->dropColumn('recipient_phone');
            $table->dropColumn('recipient_address');
            $table->dropColumn('recipient_ward');
            $table->dropColumn('recipient_district');
            $table->dropColumn('recipient_province');
            $table->dropColumn('recipient_country');
            $table->dropColumn('post_code');
            $table->dropColumn('note');
        });
    }
};
