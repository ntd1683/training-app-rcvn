<?php

use App\Http\Controllers\AnalyticController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthCustomerController;
use App\Http\Controllers\BannerController;
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
    Route::middleware(['permission'])->group(function () {
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('users.index');
            Route::get('/{id}', [UserController::class, 'edit'])->name('users.edit');
            Route::post('/', [UserController::class, 'store'])->name('users.store');
            Route::put('/{id}', [UserController::class, 'update'])->name('users.update');
            Route::patch('/{id}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.edit');
            Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.delete');
        });

        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->name('roles.index');
            Route::get('/all', [RoleController::class, 'getAll'])->name('roles.index');
            Route::get('/{role}', [RoleController::class, 'edit'])->name('roles.edit');
            Route::post('/', [RoleController::class, 'store'])->name('roles.store');
            Route::put('/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.delete');
        });

        Route::prefix('permissions')->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->name('permissions.index');
            Route::get('/all', [PermissionController::class, 'getAll'])->name('permissions.all');
            Route::get('/{id}', [PermissionController::class, 'edit'])->name('permissions.edit');
            Route::post('/', [PermissionController::class, 'store'])->name('permissions.store');
            Route::put('/{id}', [PermissionController::class, 'update'])->name('permissions.update');
            Route::delete('/{id}', [PermissionController::class, 'destroy'])->name('permissions.delete');
        });

        Route::prefix('products')->group(function () {
            Route::post('/', [ProductController::class, 'store'])->name('products.store');
            Route::post('/{id}', [ProductController::class, 'update'])->name('products.update');
            Route::delete('/{id}', [ProductController::class, 'destroy'])->name('products.delete');
        });
    });
})->middleware('throttle:60,1');

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('products.index');
    Route::get('/{id}', [ProductController::class, 'edit'])->name('products.edit');
});

Route::prefix('banners')->group(function () {
    Route::get('/', [BannerController::class, 'index'])->name('banners.index');
});

Route::post('/login', [AuthCustomerController::class, 'login'])->middleware('throttle:10,1');
Route::post('/register', [AuthCustomerController::class, 'register'])->middleware('throttle:10,1');
Route::post('/email/verify-token', [AuthCustomerController::class, 'verifyEmail'])
    ->middleware('throttle:6,1')
    ->name('api.customer.verification.verify');
Route::post('/password/email', [AuthCustomerController::class, 'sendResetLinkEmail'])
    ->middleware('throttle:6,1')
    ->name('password.email');
Route::post('/password/reset', [AuthCustomerController::class, 'reset'])
    ->middleware('throttle:6,1')
    ->name('password.reset');

Route::middleware('auth:customer')->group(function () {
    Route::post('/logout', [LogoutController::class, 'logout']);
    Route::put('/profile', [AuthCustomerController::class, 'updateProfile'])->name('profile.update');
    Route::post('/verify-token', [AuthCustomerController::class, 'verifyToken'])->name('verify.token');
    Route::post('/email/resend', [AuthCustomerController::class, 'resendEmail'])
        ->middleware('throttle:6,1')
        ->name('api.customer.verification.resend');
});
