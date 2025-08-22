<?php

use App\Http\Controllers\AnalyticController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthCustomerController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('analytics', [AnalyticController::class, 'analytic'])->name('analytics');
    Route::post('verify-token', [AuthController::class, 'verifyToken'])->name('verify.token');
    Route::get('profile', [AuthController::class, 'profile'])->name('profile.update');
    Route::post('/logout', [LogoutController::class, 'logout']);
})->middleware('throttle:300,1');

Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
