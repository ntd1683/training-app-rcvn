<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateRoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (Role::where('name', 'User')->doesntExist()) {
            $role = Role::create(['name' => 'User', 'guard_name' => 'sanctum']);
            $permission = Permission::where('name', 'products.index');
            if ($permission->exists()) {
                $role->givePermissionTo($permission->first());
            } else {
                $permission = Permission::create(['name' => 'products.index', 'guard_name' => 'sanctum']);
                $role->givePermissionTo($permission);
            }
        }

        if (User::where('email', 'user@gmail.com')->doesntExist()) {
            $user = User::create([
                'name' => "User",
                'email' => "user@gmail.com",
                'password' => Hash::make('password'),
                'verify_email' => Str::uuid(),
                'is_active' => true,
                'is_delete' => false,
                'group_role' => 'User',
            ]);

            $user->assignRole('User');
        }
    }
}
