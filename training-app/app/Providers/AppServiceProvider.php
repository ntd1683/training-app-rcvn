<?php

namespace App\Providers;

use App\Repositories\BannerRepository;
use App\Repositories\BannerRepositoryEloquent;
use App\Repositories\CustomerRepository;
use App\Repositories\CustomerRepositoryEloquent;
use App\Repositories\ImageRepository;
use App\Repositories\ImageRepositoryEloquent;
use App\Repositories\OrderDetailRepository;
use App\Repositories\OrderDetailRepositoryEloquent;
use App\Repositories\OrderRepository;
use App\Repositories\OrderRepositoryEloquent;
use App\Repositories\PaymentRepository;
use App\Repositories\PaymentRepositoryEloquent;
use App\Repositories\PaymentTransactionRepository;
use App\Repositories\PaymentTransactionRepositoryEloquent;
use App\Repositories\PermissionRepository;
use App\Repositories\PermissionRepositoryEloquent;
use App\Repositories\ProductRepository;
use App\Repositories\ProductRepositoryEloquent;
use App\Repositories\RoleRepository;
use App\Repositories\RoleRepositoryEloquent;
use App\Repositories\Services\Admin\AuthService;
use App\Repositories\Services\BannerService;
use App\Repositories\Services\CustomerService;
use App\Repositories\Services\ImageService;
use App\Repositories\Services\OrderService;
use App\Repositories\Services\PaypalService;
use App\Repositories\Services\PermissionService;
use App\Repositories\Services\ProductService;
use App\Repositories\Services\RoleService;
use App\Repositories\Services\UserService;
use App\Repositories\UserRepository;
use App\Repositories\UserRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(UserRepository::class, UserRepositoryEloquent::class);
        $this->app->bind(UserService::class, function ($app) {
            return new UserService($app->make(UserRepository::class));
        });

        $this->app->bind(CustomerRepository::class, CustomerRepositoryEloquent::class);
        $this->app->bind(CustomerService::class, function ($app) {
            return new CustomerService($app->make(CustomerRepository::class));
        });

        $this->app->bind(ImageRepository::class, ImageRepositoryEloquent::class);
        $this->app->bind(ImageService::class, function ($app) {
            return new ImageService($app->make(ImageRepository::class));
        });

        $this->app->bind(ProductRepository::class, ProductRepositoryEloquent::class);
        $this->app->bind(ProductService::class, function ($app) {
            return new ProductService(
                $app->make(ProductRepository::class),
                $app->make(ImageService::class)
            );
        });

        $this->app->bind(RoleRepository::class, RoleRepositoryEloquent::class);
        $this->app->bind(RoleService::class, function ($app) {
            return new RoleService($app->make(RoleRepository::class));
        });

        $this->app->bind(PermissionRepository::class, PermissionRepositoryEloquent::class);
        $this->app->bind(PermissionService::class, function ($app) {
            return new PermissionService($app->make(PermissionRepository::class));
        });

        $this->app->bind(AuthService::class, function ($app) {
            return new AuthService($app->make(UserRepository::class));
        });

        $this->app->bind(BannerRepository::class, BannerRepositoryEloquent::class);
        $this->app->bind(BannerService::class, function ($app) {
            return new BannerService($app->make(BannerRepository::class));
        });

        $this->app->bind(OrderDetailRepository::class, OrderDetailRepositoryEloquent::class);
        $this->app->bind(OrderRepository::class, OrderRepositoryEloquent::class);
        $this->app->bind(OrderService::class, function ($app) {
            return new OrderService(
                $app->make(OrderRepository::class),
                $app->make(ProductRepository::class),
                $app->make(OrderDetailRepository::class)
            );
        });

        $this->app->bind(PaymentRepository::class, PaymentRepositoryEloquent::class);
        $this->app->bind(PaymentTransactionRepository::class, PaymentTransactionRepositoryEloquent::class);
        $this->app->bind(PaypalService::class, function ($app) {
            return new PaypalService(
                $app->make(OrderRepository::class),
                $app->make(OrderService::class),
                $app->make(PaymentRepository::class),
                $app->make(PaymentTransactionRepository::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
