import { useMemo, useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentOrder, selectErrorUpdateOrder, selectIsUpdateOrder } from '~/redux/selectors/orders-selector';
import { handleUpdateOrder, loadOrder } from '~/redux/slices/orders-slice';
import { toast } from 'react-toastify';
import { getProvinces, getWardsByProvince } from '~/services/api-province';

export const useAdminOrderDetail = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const currentOrder = useSelector(selectCurrentOrder);
    const isLoading = useSelector(selectIsUpdateOrder);
    const errorUpdate = useSelector(selectErrorUpdateOrder);
    const [showModal, setShowModal] = useState(false);
    const [formEdit, setFormEdit] = useState({});
    const [error, setError] = useState('');
    const [dataProvinces, setDataProvinces] = useState([]);
    const [dataWards, setDataWards] = useState([]);

    useEffect(() => {
        if (id) {
            dispatch(loadOrder(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentOrder) {
            setFormEdit({
                recipient_name: currentOrder.recipient.name,
                recipient_phone: currentOrder.recipient.phone,
                recipient_address: currentOrder.recipient.address,
                recipient_ward: currentOrder.recipient.ward,
                recipient_province: currentOrder.recipient.province,
                note: currentOrder.note,
                post_code: currentOrder.post_code,
                status: currentOrder.status,
            });
        }
    }, [currentOrder]);

    const validateForm = useCallback((form) => {
        setError('');
        let isSubmit = true;

        if (!form.recipient_name || form.recipient_name.trim() === '') {
            console.log(123);
            
            isSubmit = false;
            setError({recipient_name: 'Vui lòng nhập tên người nhận'});
        } else if (form.recipient_name && form.recipient_name.length < 3) {
            isSubmit = false;
            setError({recipient_name: 'Vui lòng nhập tên người nhận hợp lệ'});
        }

        if (!form.recipient_phone || form.recipient_phone.trim() === '') {
            isSubmit = false;
            setError({recipient_phone: 'Vui lòng nhập số điện thoại người nhận'});
        } else if (form.recipient_phone && (isNaN(form.recipient_phone) || form.recipient_phone.length < 5 || form.recipient_phone.length > 12)) {
            isSubmit = false;
            setError({recipient_phone: 'Vui lòng nhập số điện thoại người nhận hợp lệ'});
        }

        if (!form.recipient_address) {
            isSubmit = false;
            setError({recipient_address: 'Vui lòng nhập địa chỉ người nhận'});
        }

        if (!form.recipient_ward) {
            isSubmit = false;
            setError({recipient_ward: 'Vui lòng chọn phường/xã người nhận'});
        }

        if (!form.recipient_province) {
            isSubmit = false;
            setError({recipient_province: 'Vui lòng chọn tỉnh/thành phố người nhận'});
        }

        if (!form.status) {
            isSubmit = false;
            setError({status: 'Vui lòng chọn trạng thái đơn hàng'});
        }

        return isSubmit;
    }, []);

    const handleEditOrder = useCallback(async () => {
        if (!validateForm(formEdit)) return;

        const response = await dispatch(handleUpdateOrder({
            orderId: id,
            orderData: formEdit,
            isAdmin: true,
        }));
        if (response.meta.requestStatus === 'fulfilled') {
            toast.success('Cập nhật đơn hàng thành công');
            setShowModal(false);
        } else {
            setError(response.payload);
            toast.error('Cập nhật đơn hàng thất bại');
        }
    }, [id, dispatch, formEdit, validateForm]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getProvinces();
                setDataProvinces(response.data);
            } catch (error) {
                throw new Error(`Error fetching provinces: ${error.message}`);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchWards = async (provinceCode) => {
            try {
                const response = await getWardsByProvince(provinceCode);
                setDataWards(response.data);
            } catch (error) {
                throw new Error(`Error fetching wards for province ${provinceCode}: ${error.message}`);
            }
        };
        if (formEdit.recipient_province) {
            const selectedProvince = dataProvinces.find(p => p.name === formEdit.recipient_province);
            fetchWards(selectedProvince?.code);
        }
    }, [formEdit.recipient_province, dataProvinces]);

    return useMemo(() => ({
        id,
        currentOrder,
        isLoading,
        handleEditOrder,
        error,
        errorUpdate,
        showModal,
        setShowModal,
        formEdit,
        setFormEdit,
        dataProvinces,
        dataWards,
    }), [
        id,
        currentOrder,
        isLoading,
        error,
        errorUpdate,
        handleEditOrder,
        showModal,
        setShowModal,
        formEdit,
        setFormEdit,
        dataProvinces,
        dataWards,
    ]);
}