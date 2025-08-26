export const listNav = [
  {
    permission: 'dashboard.index',
    path: '/admin/dashboard',
    icon: 'bx:bx-home-smile',
    label: 'Dashboards',
  },
  {
    permission: 'users.index',
    path: '/admin/users',
    icon: 'bx:user-voice',
    label: 'Users',
    children: [
      { path: '/admin/users', label: 'Danh sách Nhân Viên', permission: 'users.index' },
      { path: '/admin/users/create', label: 'Thêm Nhân Viên', permission: 'users.create' }
    ]
  },
  {
    permission: 'customers.index',
    path: '/admin/customers',
    icon: 'bx:user',
    label: 'Khách hàng',
    children: [
      { path: '/admin/customers', label: 'Danh sách Khách Hàng', permission: 'customers.index' },
      { path: '/admin/customers/create', label: 'Thêm Khách Hàng', permission: 'customers.create' }
    ]
  },
  {
    permission: 'roles.index',
    path: '/admin/roles',
    icon: 'bx:lock-open',
    label: 'Quản lý Vai Trò',
    children: [
      { path: '/admin/roles', label: 'Danh sách Vai Trò', permission: 'roles.index' },
      { path: '/admin/roles/create', label: 'Thêm Vai Trò', permission: 'roles.create' }
    ]
  },
  {
    permission: 'permissions.index',
    path: '/admin/permissions',
    icon: 'bx:book-reader',
    label: 'Quản lý Quyền',
    children: [
      { path: '/admin/permissions', label: 'Danh sách Quyền', permission: 'permissions.index' },
      { path: '/admin/permissions/create', label: 'Thêm Quyền', permission: 'permissions.create' }
    ]
  },
  {
    permission: 'products.index',
    path: '/admin/products',
    icon: 'bx:cart-alt',
    label: 'Sản Phẩm',
    children: [
      { path: '/admin/products', label: 'Danh sách Sản Phẩm', permission: 'products.index' },
      { path: '/admin/products/create', label: 'Thêm Sản Phẩm', permission: 'products.create' },
      { path: '/admin/categories', label: 'Danh Mục', permission: 'categories.index' }
    ]
  }
];