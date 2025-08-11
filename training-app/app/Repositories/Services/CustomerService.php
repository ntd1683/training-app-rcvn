<?php

namespace App\Repositories\Services;

use App\Repositories\Criteria\UserFilterCriteria;
use App\Repositories\CustomerRepository;
use App\Repositories\UserRepository;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Enums\DefaultRoleEnum;
use Exception;
use Throwable;

/**
 * Class UserService
 * Handles business logic for User operations.
 */
class CustomerService
{
    protected $customerRepository;

    /**
     * UserService constructor.
     *
     * @param CustomerRepository $customerRepository
     */
    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * Get all customers
     *
     * @return Collection
     */
    public function getAllCustomers()
    {
        return $this->customerRepository->all();
    }

    /**
     * Find a customer by ID
     *
     * @param  int $id
     * @return Model|null
     */
    public function getCustomerById($id)
    {
        $customer = $this->customerRepository->find($id);
        if (!$customer) {
            throw new Exception('Không tìm thấy người dùng', 404);
        }

        return $customer;
    }

    /**
     * Create a new customer
     *
     * @param  array $data
     * @return Model
     * @throws Exception|Throwable
     */
    public function createCustomer(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        DB::beginTransaction();
        try {
            $customer = $this->customerRepository->create($data);

            $role = Role::findByName('customer', 'customer');
            if (!$role) {
                throw new Exception('Vai trò không hợp lệ', 400);
            }
            $customer->assignRole($role);

            DB::commit();
            return $customer;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update a user
     *
     * @param  int   $id
     * @param  array $data
     * @return \Illuminate\Database\Eloquent\Model
     * @throws Exception
     */
    public function updateCustomer($id, array $data, $currentUser = null)
    {
        $customer = $this->customerRepository->find($id);
        if (!$customer) {
            throw new Exception('Không tìm thấy user', 404);
        }

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['is_delete'])) {
            $data['is_delete'] = false;
        }

        DB::beginTransaction();
        try {
            $updatedCustomer = $this->customerRepository->update($data, $id);
            DB::commit();
            return $updatedCustomer;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a customer
     *
     * @param  int                                             $id
     * @param  \Illuminate\Contracts\Auth\Authenticatable|null $currentCustomer
     * @return bool
     * @throws Exception
     */
    public function deleteCustomer($id, $currentUser = null)
    {
        if ($currentUser && $currentUser->id === $id) {
            throw new Exception('Bạn không thể xóa chính mình', 403);
        }

        $customer = $this->customerRepository->find($id);
        if (!$customer) {
            throw new Exception('Không tìm thấy user', 404);
        }

        \Log::info("UserService: User $currentUser->id Attempting to soft delete user with ID: $id");
        return $customer->delete();
    }

    /**
     * Find a customer by email
     *
     * @param  string $email
     * @return Model|null
     */
    public function findCustomerByEmail($email)
    {
        return $this->customerRepository->findByEmail($email);
    }
}
