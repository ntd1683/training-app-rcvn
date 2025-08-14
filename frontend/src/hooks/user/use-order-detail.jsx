import { useMemo, useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentOrder, selectCurrentOrderError, selectCurrentOrderLoading } from '~/redux/selectors/orders-selector';
import { approveCheckout, loadOrder, rePay } from '~/redux/slices/orders-slice';
import { toast } from 'react-toastify';

export const useOrderDetail = () => {
    const { id } = useParams();

    const dispatch = useDispatch();
    const currentOrder = useSelector(selectCurrentOrder);
    const isLoading = useSelector(selectCurrentOrderLoading);
    const error = useSelector(selectCurrentOrderError);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(loadOrder(id));
        }
    }, [dispatch, id]);

    const handleCreateOrder = useCallback(async () => {
        try {
            const response = await dispatch(rePay(id));
            if (rePay.fulfilled.match(response)) {
                return response.payload.data.id;
            }
        } catch (error) {
            throw error;
        }
    }, [id, dispatch]);

    const handleApproveOrder = useCallback(async (data) => {
        try {
            const response = await dispatch(approveCheckout(data.orderID));
            if (approveCheckout.fulfilled.match(response)) {
                toast.success('Thanh toán thành công!');
            } else {
                toast.error('Thanh toán thất bại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thanh toán!');
        }
    }, [dispatch]);

    const handleCancelOrder = useCallback(() => {
        toast.info('Thanh toán đã bị huỷ!');
    }, []);

    const handleErrorOrder = useCallback((data) => {
        toast.error('Có lỗi xảy ra khi thanh toán!');
    }, []);

    return useMemo(() => ({
        id,
        currentOrder,
        isLoading,
        error,
        handleCreateOrder,
        handleApproveOrder,
        handleCancelOrder,
        handleErrorOrder,
        showModal,
        setShowModal,
    }), [
        id,
        currentOrder,
        isLoading,
        error,
        handleCreateOrder,
        handleApproveOrder,
        handleCancelOrder,
        handleErrorOrder,
        showModal,
        setShowModal,
    ]);
}