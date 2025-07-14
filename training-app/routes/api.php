<?php

use App\Http\Controllers\AnalyticController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/analytics', [AnalyticController::class, 'analytic'])->name('analytics');
    Route::post('/verify-token', [AuthController::class, 'verifyToken'])->name('verify.token');
    Route::get('/user', [AuthController::class, 'profile'])->name('profile.update');

    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::get('roles/all', [RoleController::class, 'getAll'])->name('roles.index');
    Route::get('permissions/all', [PermissionController::class, 'getAll'])->name('permissions.index');

    Route::middleware(['role:Admin','permission'])->group(function () {
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('users.index');
            Route::get('/{id}', [UserController::class, 'edit'])->name('users.edit');
            Route::post('/', [UserController::class, 'store'])->name('users.store');
            Route::put('/{id}', [UserController::class, 'update'])->name('users.update');
            Route::patch('/{id}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.edit');
            Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.delete');
        });

        Route::prefix('roles')->group(function () {
            Route::get('/{role}', [RoleController::class, 'edit'])->name('roles.edit');
            Route::post('/', [RoleController::class, 'store'])->name('roles.store');
            Route::put('/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('/{role}', [RoleController::class, 'destroy'])->name('roles.delete');
        });

        Route::prefix('permissions')->group(function () {
            Route::get('/{id}', [PermissionController::class, 'edit'])->name('permissions.edit');
            Route::post('/', [PermissionController::class, 'store'])->name('permissions.store');
            Route::put('/{id}', [PermissionController::class, 'update'])->name('permissions.update');
            Route::delete('/{id}', [PermissionController::class, 'destroy'])->name('permissions.delete');
        });

        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('products.index');
            Route::get('/{id}', [ProductController::class, 'edit'])->name('products.edit');
            Route::post('/', [ProductController::class, 'store'])->name('products.store');
            Route::post('/{id}', [ProductController::class, 'update'])->name('products.update');
            Route::delete('/{id}', [ProductController::class, 'destroy'])->name('products.delete');
        });
    });
});

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::get('/images/products/{image}', [ImageController::class, 'show'])
    ->name('images.show')->middleware(['throttle:100,1', 'check.file.allow.domain']);
