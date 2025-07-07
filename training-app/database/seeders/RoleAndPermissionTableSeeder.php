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
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'Editor']);
        Role::create(['name' => 'Reviewer']);

        Permission::create(['name' => 'edit-product']);
        Permission::create(['name' => 'delete-product']);
        Permission::create(['name' => 'edit-user']);
        Permission::create(['name' => 'delete-user']);

        $roleAdmin = Role::findByName('Admin');
        $roleAdmin->givePermissionTo('edit-product', 'delete-product', 'edit-user', 'delete-user');

        $roleEditor = Role::findByName('Editor');
        $roleEditor->givePermissionTo('edit-product', 'delete-product');

        $users = User::all();

        foreach ($users as $user) {
            if ($user->group_role === 'Admin') {
                $user->assignRole('Admin');
            } elseif ($user->group_role === 'Editor') {
                $user->assignRole('Editor');
            } elseif ($user->group_role === 'Reviewer') {
                $user->assignRole('Reviewer');
            }
        }
    }
}
