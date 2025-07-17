<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateAccountSupperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role = Role::create(['name' => 'SuperAdmin', 'guard_name' => 'sanctum']);
        $permissions = Permission::all();
        foreach ($permissions as $permission) {
            $role->givePermissionTo($permission);
        }

        $user = User::create([
            'name' => "Super Admin",
            'email' => "superadmin@gmail.com",
            'password' => Hash::make('password'),
            'verify_email' => Str::uuid(),
            'is_active' => true,
            'is_delete' => false,
            'group_role' => 'SuperAdmin',
        ]);

        $user->assignRole('SuperAdmin');
    }
}
