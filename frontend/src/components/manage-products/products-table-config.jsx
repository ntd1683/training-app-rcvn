import { Icon } from '@iconify/react';
import ProductStatus from '~/constants/product-status';
import '~/assets/css/image-tooltip.css';
import { checkRoleAndPermission } from '~/utils/common';

const stripHtmlAndTruncate = (html, maxLength = 50) => {
    if (!html) return 'Không có mô tả';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    if (textContent.length > maxLength) {
        return `${textContent.substring(0, maxLength)}...`;
    }

    return textContent;
};

const NameWithImageTooltip = ({ row }) => {
    return (
        <div className="position-relative">
            <span
                className="product-name-hover"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={row.name}
                style={{ cursor: 'pointer' }}
            >
                {row.name}
            </span>

            {row.image_url && (
                <div className="image-tooltip">

                    <img
                        src={row.image_url}
                        alt={row.name}
                        style={{
                            width: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        loading="lazy"
                    />
                </div>

            )}
        </div>
    );
};

export const columns = (navigate, pagination, setSelectedProduct, setShowDeleteModal) => [
    {
        id: 'index',
        name: '#',
        cell: (row, index) => index + 1 + (pagination.current_page - 1) * pagination.per_page,
        sortable: false,
        width: '80px',
    },
    {
        id: 'name',
        name: 'Tên Sản Phẩm',
        selector: row => row.name,
        sortable: true,
        cell: row => <NameWithImageTooltip row={row} />,
    },
    {
        id: 'description',
        name: 'Mô tả',
        selector: row => stripHtmlAndTruncate(row.description, 50),
        cell: row => (
            <span
                title={stripHtmlAndTruncate(row.description, 200)}
                style={{ cursor: 'help' }}
            >
                {stripHtmlAndTruncate(row.description, 50)}
            </span>
        ),
    },
    {
        id: 'price',
        name: 'Giá',
        selector: row => row.price,
        cell: row => {
            const currency = row.currency || 'USD';
            let locale;
            switch (currency) {
                case 'VND':
                    locale = 'vi-VN';
                    break;
                case 'JPY':
                    locale = 'ja-JP';
                    break;
                case 'USD':
                default:
                    locale = 'en-US';
                    break;
            }
            return row.price.toLocaleString(locale, { style: 'currency', currency: currency });
        },
        sortable: true,
        sortBy: 'price',
        right: true,
    },
    {
        id: 'status',
        name: 'Tình trạng',
        sortable: true,
        selector: row => row.status,
        cell: row => {
            const status = row.status;
            let colorStatus = "";
            switch (status) {
                case ProductStatus.STOPPED:
                    colorStatus = 'bg-danger';
                    break;
                case ProductStatus.SELLING:
                    colorStatus = 'bg-primary';
                    break;
                case ProductStatus.OUT_OF_STOCK:
                    colorStatus = 'bg-secondary';
                    break;
                default:
                    colorStatus = 'bg-primary';
            }

            return (
                <span className={`badge ${colorStatus} me-1`} style={{ fontSize: '13px' }}>
                    {ProductStatus.getStatusText(status)}
                </span>
            );
        },
    },
    {
        id: 'actions',
        name: '',
        cell: (row) => (
            <div className="d-flex gap-2">
                { checkRoleAndPermission('products.edit') && (
                    <button type="button" className="btn p-0" onClick={() => {
                        navigate(`/admin/products/edit/${row.id}`);
                    }}>
                        <Icon icon="bx:pen" className="text-primary fs-4" />
                    </button>
                )}
                { checkRoleAndPermission('products.delete') && (
                    <button type="button" className="btn p-0" onClick={() => {
                        setSelectedProduct(row);
                        setShowDeleteModal(true);
                    }}>
                        <Icon icon="bx:trash" className="text-danger fs-4" />
                    </button>
                )}
            </div>
        ),
        allowOverflow: true,
        button: true,
        sortable: false,
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
        },
    },
};