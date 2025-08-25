<?php

namespace App\Repositories\Services;

use App\Repositories\Criteria\CustomerFilterCriteria;
use App\Repositories\CustomerRepository;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Exception;
use Throwable;

/**
 * Class CustomerService
 * Handles business logic for Customer operations.
 */
class CustomerService
{
    protected $customerRepository;

    /**
     * CustomerService constructor.
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
     * @param int $id
     * @return Model|null
     * @throws Exception
     */
    public function getCustomerById($id)
    {
        $customer = $this->customerRepository
            ->withTrashed()
            ->find($id);

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
        return $this->customerRepository->create($data);
    }

    /**
     * Update a customer
     *
     * @param int $id
     * @param array $data
     * @param $currentCustomer
     * @return Model
     * @throws Throwable
     */
    public function updateCustomer($id, array $data, $currentCustomer = null)
    {
        $customer = $this->customerRepository
            ->withTrashed()
            ->find($id);

        if (!$customer) {
            throw new Exception('Không tìm thấy khách hàng', 404);
        }

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        DB::beginTransaction();
        try {
            $this->customerRepository->withTrashed()->update($data, $id);
            DB::commit();

            $updatedCustomer = $this->customerRepository
                ->withTrashed()
                ->find($id);
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
     * @param  Authenticatable|null $currentCustomer
     * @return int
     * @throws Exception
     */
    public function deleteCustomer($id, $currentCustomer = null)
    {
        if ($currentCustomer && $currentCustomer->id === $id) {
            throw new Exception('Bạn không thể xóa chính mình', 403);
        }

        $customer = $this->customerRepository->find($id);

        if (!$customer) {
            throw new Exception('Không tìm thấy Khách Hàng', 404);
        }

        $current = auth()->user();
        \Log::info("Customer Service: Customer $current->id Attempting to soft delete customer with ID: $id");
        return $this->customerRepository->delete($id);
    }

    /**
     * Restore a soft-deleted customer
     *
     * @param int $id
     * @return bool
     * @throws Exception
     */
    public function restoreCustomer($id)
    {
        $restored = $this->customerRepository->resetDeletedAt($id);
        if (!$restored) {
            throw new Exception('Không thể khôi phục khách hàng hoặc khách hàng không tồn tại', 400);
        }
        return $restored;
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

    /**
     * Get filtered and paginated customers
     *
     * @param  array $filters
     * @return LengthAwarePaginator
     */
    public function getFilteredCustomers(array $filters)
    {
        $query = $this->customerRepository->newQuery();

        $criteria = new CustomerFilterCriteria($filters);
        $query = $criteria->apply($query, $this->customerRepository);

        $count = $query->count();

        $perPage = $count > 20 ? ($filters['per_page'] ?? 10) : 20;
        $currentPage = $filters['page'] ?? 1;

        return $query->paginate($perPage, ['*'], 'page', $currentPage);
    }
}
