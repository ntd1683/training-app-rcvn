import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, deleteProduct, createProduct, updateProduct } from '~/services/api';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';

export const useCreateOrEditProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        currency: "USD",
        status: '',
        image: null,
    });
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorName, setErrorName] = useState();
    const [errorDescription, setErrorDescription] = useState();
    const [errorPrice, setErrorPrice] = useState();
    const [errorCurrency, setErrorCurrency] = useState();
    const [errorStatus, setErrorStatus] = useState();
    const [errorImage, setErrorImage] = useState();
    const [errorDeleted, setErrorDeleted] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorDelete, setErrorDelete] = useState();

    const navigate = useNavigate();

    const path = window.location.pathname;
    const isEdit = path.split('/')[2] === 'edit' ? true : false;
    const { id } = useParams();
    const title = isEdit ? 'Chỉnh Sửa' : 'Thêm';

    if (isEdit && !id) {
        navigate('/products', { state: { error: 'Không tìm thấy ID sản phẩm để chỉnh sửa' } });
    }

    const fetchUser = useCallback(async () => {
        if (isEdit && id) {
            try {
                const response = await fetchProductById(id);
                if (response) {
                    setProduct({
                        name: response.name || '',
                        description: response.description || '',
                        price: response.price || 0,
                        currency: response.currency || 1,
                        status: response.status || 0,
                        image: response.image_url || null
                    });
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    }, [isEdit, id]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const sanitizeContent = (html) => {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
            ALLOWED_ATTR: ['href', 'target', 'rel'],
            FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
            FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!product.name) {
            setErrorName('Vui lòng nhập tên sản phẩm đầy đủ');
            setIsLoading(false);
            return;
        } else if (product.name.length < 5 || product.name.length > 255) {
            setErrorName('Tên không hợp lệ, phải từ 5 đến 255 ký tự');
            setIsLoading(false);
            return;
        } else {
            setErrorName('');
        }

        if (!product.description) {
            setErrorDescription('Vui lòng nhập mô tả sản phẩm');
            setIsLoading(false);
            return;
        } else {
            setErrorDescription('');
        }

        if (!product.price) {
            setErrorPrice('Vui lòng nhập giá sản phẩm');
            setIsLoading(false);
            return;
        } else if (product.price <= 0) {
            setErrorPrice('Vui lòng nhập giá sản phẩm lớn hơn 0');
            setIsLoading(false);
            return;
        } else if (isNaN(product.price)) {
            setErrorPrice('Vui lòng nhập giá sản phẩm là số');
            setIsLoading(false);
            return;
        } else {
            setErrorPrice('');
        }

        if (product.currency < 1 || product.currency > 3) {
            setErrorCurrency('Vui lòng chọn loại tiền tệ hợp lệ');
            setIsLoading(false);
            return;
        } else {
            setErrorCurrency('');
        }

        if (!product.status) {
            setErrorStatus('Vui lòng chọn trạng thái sản phẩm');
            setIsLoading(false);
            return;
        } else if (product.status < 0 || product.status > 2) {
            setErrorStatus('Vui lòng chọn trạng thái hợp lệ');
            setIsLoading(false);
            return;
        } else {
            setErrorStatus('');
        }

        if (image && image.size > 2 * 1024 * 1024) {
            setErrorImage('Kích thước ảnh không được vượt quá 2MB');
            setIsLoading(false);
            return;
        } else if (image && image.type !== 'image/jpeg' && image.type !== 'image/png' && image.type !== 'image/jpg') {
            setErrorImage('Vui lòng chọn ảnh có định dạng jpg, jpeg hoặc png');
            setIsLoading(false);
            return;
        } else if (image && (image.width > 1024 || image.height > 1024)) {
            setErrorImage('Kích thước ảnh không được vượt quá 1024x1024 pixels');
            setIsLoading(false);
            return;
        } else {
            setErrorImage('');
        }

        setProduct({
            ...product,
            description: sanitizeContent(product.description)
        });

        console.log('image', image);
        
        if (!isEdit) {
            try {
                await createProduct({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    currency: product.currency,
                    status: product.status,
                    image: image,
                });
                navigate('/products', { state: { success: 'Tạo sản phẩm thành công' } });
            } catch (error) {
                console.error('Error creating product:', error);
                toast.error(`Tạo sản phẩm không thành công: ${error.response.data.message}`);
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
        } else {
            try {
                await updateProduct(id,{
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    currency: product.currency,
                    status: product.status,
                    image: image,
                    image_url: product.image,
                });
                navigate('/products', { state: { success: 'Chỉnh sửa sản phẩm thành công' } });
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error('Cập nhật sản phẩm không thành công');
                setIsLoading(false);
                return;
            }
            setIsLoading(false);
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        setErrorDelete('');
        try {
            const response = await deleteProduct(id);

            if (!response) {
                throw new Error('Xoá sản phẩm không thành công');
            }

            setShowDeleteModal(false);
            toast.success('Xoá sản phẩm thành công');
            navigate('/products', { state: { success: 'Xoá sản phẩm thành công' } });
        } catch (error) {
            console.error('Error deleting user:', error);
            setErrorDelete('Xoá sản phẩm không thành công');
        } finally {
            setIsDeleting(false);
        }
    }

    return {
        product,
        setProduct,
        isEdit,
        title,
        isLoading,
        image,
        setImage,
        errorName,
        setErrorName,
        errorDescription,
        setErrorDescription,
        errorPrice,
        setErrorPrice,
        errorCurrency,
        setErrorCurrency,
        errorStatus,
        setErrorStatus,
        errorImage,
        setErrorImage,
        errorDeleted,
        setErrorDeleted,
        handleSubmit,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        handleDelete,
        errorDelete,
    }
}