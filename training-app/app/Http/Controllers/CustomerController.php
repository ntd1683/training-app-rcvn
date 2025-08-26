<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerCreateRequest;
use App\Http\Requests\CustomerSearchRequest;
use App\Http\Requests\CustomerUpdateRequest;
use App\Http\Resources\CustomerCollection;
use App\Http\Resources\CustomerResource;
use App\Repositories\Services\CustomerService;
use Exception;

class CustomerController extends Controller
{
    protected CustomerService $customerService;

    /**
     * Customer Controller constructor.
     *
     * @param CustomerService $customerService
     */
    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function index(CustomerSearchRequest $request)
    {
        try {
            $validated = $request->validated();
            $customers = $this->customerService->getFilteredCustomers($validated);

            return new CustomerCollection($customers);
        } catch (Exception $e) {
            return (new CustomerResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function store(CustomerCreateRequest $request)
    {
        try {
            $customer = $this->customerService->createCustomer($request->validated());
            return new CustomerResource($customer, null, 'CREATED');
        } catch (Exception $e) {
            return (new CustomerResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function edit($id)
    {
        try {
            $user = $this->customerService->getCustomerById($id);
            return new CustomerResource($user);
        } catch (Exception $e) {
            return (new CustomerResource(null))->errorResponse(
                $e->getCode() ?: 'NOT_FOUND',
                null,
                'Không tìm thấy user hoặc có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function update(CustomerUpdateRequest $request, $id)
    {
        try {
            $customer = $this->customerService->updateCustomer($id, $request->validated(), auth()->user());
            \Log::info($customer);
            return new CustomerResource($customer, 'Cập nhật khách hàng thành công');
        } catch (Exception $e) {
            return (new CustomerResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function delete($id)
    {
        try {
            $this->customerService->deleteCustomer($id);
            return new CustomerResource(null, 'Xóa khách hàng thành công');
        } catch (Exception $e) {
            return (new CustomerResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }

    public function restore($id)
    {
        try {
            $this->customerService->restoreCustomer($id);
            return new CustomerResource(null, 'Khôi phục khách hàng thành công');
        } catch (Exception $e) {
            return (new CustomerResource(null))->errorResponse(
                $e->getCode() ?: 'SERVER_ERROR',
                null,
                'Có lỗi xảy ra: ' . $e->getMessage()
            );
        }
    }
}
