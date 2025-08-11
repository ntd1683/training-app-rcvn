import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectBannersAdsCheckout, selectIsLoadingAdsCheckout } from '~/redux/selectors/banners-selector';
import { loadAdsBannersCheckout } from '~/redux/slices/banners-slice';
import { clearCart } from '~/redux/slices/cart-slice';
import { useUserInfo } from '~/hooks/user/use-auth.jsx';
import { getProvinces, getWardsByProvince } from '~/services/api-province.jsx';
import {
    selectCartItems,
    selectCartTotalAmount,
} from '~/redux/selectors/cart-selector';
import { createOrder, approveOrder } from '~/services/api';
import { toast } from 'react-toastify';

export const useCheckout = () => {
    // Todo: Implement fee logic if needed
    // eslint-disable-next-line
    const [fee, setFee] = useState(0);
    const isMounted = useRef(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const adsBanner = useSelector(selectBannersAdsCheckout);
    const isLoadingSlide = useSelector(selectIsLoadingAdsCheckout);
    const [dataProvinces, setDataProvinces] = useState([]);
    const [dataWards, setDataWards] = useState([]);


    const { user } = useUserInfo();
    const memoizedUser = useMemo(() => user, [user]);

    const [shippingInfo, setShippingInfo] = useState({
        'name': user?.name || '',
        'email': user?.email || '',
        'phone': '',
        'address': '',
        'province': '',
        'ward': '',
        'postCode': '',
        'note': '',
    });

    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        address: '',
        province: '',
        ward: '',
        postCode: '',
        note: '',
    });
    const [loading, setLoading] = useState(false);
    const [checkout, setCheckout] = useState(false);

    const cartItems = useSelector(selectCartItems);
    const totalAmount = useSelector(selectCartTotalAmount);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/gio-hang', { state: { error: "Giỏ hàng trống!" } });
        }
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            dispatch(loadAdsBannersCheckout());
        }
    }, [dispatch]);

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
        if (shippingInfo.province) {
            fetchWards(shippingInfo.province);
        }
    }, [shippingInfo.province]);

    const handleShippingInfoChange = (name, value) => {
        setShippingInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const formValidation = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        if (!shippingInfo.name) {
            newErrors.name = 'Tên đầy đủ không được bỏ trống';
            isValid = false;
        } else if (shippingInfo.name.length < 3) {
            newErrors.name = 'Tên đầy đủ phải có ít nhất 3 ký tự';
            isValid = false;
        } else if (/^[a-zA-Z\s]*$/.test(shippingInfo.name)) {
            newErrors.name = 'Tên đầy đủ không được chứa kí tự đặc biệt';
            isValid = false;
        }

        if (!shippingInfo.phone) {
            newErrors.phone = 'Số điện thoại không được bỏ trống';
            isValid = false;
        } else if (isNaN(shippingInfo.phone) || shippingInfo.phone.length < 10 || shippingInfo.phone.length > 11) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        if (!shippingInfo.address) {
            newErrors.address = 'Địa chỉ không được bỏ trống';
            isValid = false;
        }

        if (!shippingInfo.province || shippingInfo.province === '') {
            newErrors.province = 'Tỉnh/Thành phố không được bỏ trống';
            isValid = false;
        }

        if (!shippingInfo.ward || shippingInfo.ward === '') {
            newErrors.ward = 'Quận/Huyện không được bỏ trống';
            isValid = false;
        }

        if (!shippingInfo.postCode) {
            newErrors.postCode = 'Mã bưu chính không được bỏ trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [shippingInfo]);

    const handleCheckout = useCallback((e) => {
        e.preventDefault();
        const validate = formValidation();
        if (validate) {
            setCheckout(true);
        }
    }, [formValidation]);

    const handleCreateOrder = useCallback(async () => {
        setLoading(true);
        const validate = formValidation();
        if (!validate) {
            setCheckout(false);
            return;
        }

        try {
            const response = await createOrder({
                products: cartItems,
                name: shippingInfo.name,
                phone: shippingInfo.phone,
                address: shippingInfo.address,
                province: shippingInfo.province,
                ward: shippingInfo.ward,
                postCode: shippingInfo.postCode,
                note: shippingInfo.note,
            });
            return response.data.id;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }, [formValidation, cartItems, shippingInfo]);

    const handleApproveOrder = useCallback(async (data) => {
        try {
            const response = await approveOrder(data.orderID);
            if (response.success) {
                dispatch(clearCart());
                navigate('/', {state: {success: "Thanh toán thành công!"}});
            } else {
                toast.error('Thanh toán thất bại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thanh toán!');
        }
    }, [navigate, dispatch]);

    const handleCancelOrder = useCallback(() => {
        toast.info('Thanh toán đã bị hủy!');
    }, []);

    const handleErrorOrder = useCallback(() => {
        toast.error('Có lỗi xảy ra khi thanh toán!');
    }, []);

    return useMemo(() => ({
        fee,
        adsBanner,
        isLoadingSlide,
        user: memoizedUser,
        shippingInfo,
        handleShippingInfoChange,
        dataProvinces,
        dataWards,
        products: cartItems,
        totalAmount,
        handleCreateOrder,
        handleApproveOrder,
        handleCancelOrder,
        handleErrorOrder,
        handleCheckout,
        errors,
        checkout,
        loading,
    }), [fee,
        adsBanner,
        isLoadingSlide,
        memoizedUser,
        shippingInfo,
        dataProvinces,
        dataWards,
        cartItems,
        totalAmount,
        handleCreateOrder,
        handleApproveOrder,
        handleCancelOrder,
        handleErrorOrder,
        handleCheckout,
        errors,
        checkout,
        loading,
    ]);
}