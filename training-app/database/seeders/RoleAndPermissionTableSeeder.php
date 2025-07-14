<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::create(['name' => 'Admin', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'Editor', 'guard_name' => 'sanctum']);
        Role::create(['name' => 'Reviewer', 'guard_name' => 'sanctum']);

        $permissionProduct = [];
        $permissionUser = [];
        $permissionRoles = [];
        $permissionPermissions = [];

        $suffixRoute = ['store', 'index', 'edit', 'update', 'delete'];
        $prefixRoute = ['products', 'users', 'roles', 'permissions'];
        foreach ($prefixRoute as $model) {
            foreach ($suffixRoute as $route) {
                $namePermission = "{$model}.{$route}";
                if ($model === 'products') {
                    $permissionProduct[] = $namePermission;
                } elseif ($model === 'users') {
                    $permissionUser[] = $namePermission;
                } elseif($model === 'roles') {
                    $permissionRoles[] = $namePermission;
                } elseif($model === 'permissions') {
                    $permissionPermissions[] = $namePermission;
                }
                Permission::create(['name' => $namePermission, 'guard_name' => 'sanctum']);
            }
        }

        $roleAdmin = Role::findByName('Admin', 'sanctum');
        $roleAdmin->givePermissionTo(array_merge($permissionProduct, $permissionUser, $permissionRoles, $permissionPermissions));

        $roleEditor = Role::findByName('Editor', 'sanctum');
        $roleEditor->givePermissionTo($permissionProduct);

        $users = User::all();

        foreach ($users as $user) {
            if ($user->group_role === 'Admin') {
                $user->assignRole($roleAdmin);
            } elseif ($user->group_role === 'Editor') {
                $user->assignRole($roleEditor);
            } elseif ($user->group_role === 'Reviewer') {
                $reviewerRole = Role::findByName('Reviewer', 'sanctum');
                $user->assignRole($reviewerRole);
            }
        }
    }
}
