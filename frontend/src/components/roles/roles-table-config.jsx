import { Icon } from '@iconify/react';

const processPermissions = (permissions) => {
    const groupedPermissions = {};
    const crudActions = ['index', 'store', 'edit', 'update', 'delete'];
    
    permissions.forEach(permission => {
        const parts = permission.name.split('.');
        if (parts.length === 2) {
            const [module, action] = parts;
            if (!groupedPermissions[module]) {
                groupedPermissions[module] = [];
            }
            groupedPermissions[module].push(action);
        }
    });
    
    const result = [];
    
    Object.keys(groupedPermissions).forEach(module => {
        const actions = groupedPermissions[module];
        const hasAllCrud = crudActions.every(action => actions.includes(action));
        
        const displayParts = [];
        const moduleName = module.charAt(0).toUpperCase() + module.slice(1);
        
        if (actions.includes('index')) {
            displayParts.push('Xem');
        }
        
        if (actions.includes('store')) {
            displayParts.push('Thêm');
        }
        
        if (actions.includes('edit') && actions.includes('update')) {
            displayParts.push('Sửa');
        }
        
        if (actions.includes('delete')) {
            displayParts.push('Xoá');
        }
        
        if (displayParts.length > 0) {
            result.push({
                display: `${moduleName}: ${displayParts.join('-')}`,
                type: hasAllCrud ? 'full' : 'partial',
                module: module
            });
        }
    });
    
    return result;
};

export const columns = (navigate, pagination) => [
    {
        name: '#',
        cell: (row, index) => index + 1 + (pagination.current_page - 1) * pagination.per_page,
        sortable: false,
        minWidth: '50px',
        maxWidth: '50px',
        center: true,
    },
    {
        name: 'Tên vai trò',
        selector: row => row.name,
        minWidth: '120px',
        maxWidth: '200px',
        sortable: true,
        center: true,
    },
    {
        name: 'Quyền',
        cell: (row) => {
            const permissions = processPermissions(row.permissions);
            if (permissions.length === 0) {
                return <span className="text-muted">Không có quyền</span>;
            }
            
            return (
                <div className="d-flex flex-column mt-2">
                    {permissions.slice(0,3).map((perm, index) => {
                        const badgeClass = perm.type === 'full' ? 'bg-primary' : 'bg-secondary';
                        return (
                            <span key={index} className={`badge ${badgeClass} mb-1`} style={{ fontSize: '14px' }}>
                                {perm.display}
                            </span>
                        );
                    })}

                    {permissions.length > 3 && (
                        <span className="badge bg-primary mb-1" style={{ fontSize: '14px' }}>
                            + {permissions.length - 3} quyền khác
                        </span>
                    )}
                </div>
            );
        },
        center: true,
    },
    {
        name: 'Số lượng người dùng',
        selector: row => row.users_count,
        minWidth: '120px',
        maxWidth: '200px',
        sortable: true,
        center: true,
    },
    {
        name: 'Hành động',
        cell: (row) => (
            <div className="d-flex gap-2">
                <button type="button" className="btn p-0" onClick={() => {
                    navigate(`/roles/edit/${row.name}`);
                }}>
                    <Icon icon="bx:pen" className="text-primary" width="20px"/>
                    <span className="ms-1 d-none d-sm-inline">Chỉnh Sửa</span>
                </button>
            </div>
        ),
        allowOverflow: true,
        sortable: false,
        minWidth: '100px',
        maxWidth: '200px',
        center: true,
    },
];

export const customStyles = {
    headCells: {
        style: {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold',
            fontSize: '14px',
        },
    },
    cells: {
        style: {
            padding: '12px',
            fontSize: '14px',
            minHeight: '60px',
        },
    },
    table: {
        style: {
            minWidth: '100%',
            tableLayout: 'fixed',
        },
    },
    tableWrapper: {
        style: {
            display: 'block',
            overflowX: 'auto',
            width: '100%',
        },
    },
};