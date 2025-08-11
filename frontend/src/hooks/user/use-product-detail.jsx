import { useMemo, useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentProduct, selectCurrentProductLoading, selectCurrentProductError } from '~/redux/selectors/products-selector';
import { loadProduct } from '~/redux/slices/products-slice';
import { addToCartWithQuantity } from '~/redux/slices/cart-slice';

export const useProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [errorAdd, setErrorAdd] = useState(null);

    const dispatch = useDispatch();
    const currentProduct = useSelector(selectCurrentProduct);
    const isLoading = useSelector(selectCurrentProductLoading);
    const error = useSelector(selectCurrentProductError);

    useEffect(() => {
        if (id) {
            dispatch(loadProduct(id));
        }
    }, [dispatch, id]);

    const handleAddToCart = useCallback(() => {
        setErrorAdd(null);
        if (!currentProduct || currentProduct.quantity === 0) {
            setErrorAdd('Sản phẩm không còn hàng hoặc không hợp lệ.');
            return;
        }

        if (currentProduct.quantity < quantity) {
            setErrorAdd('Số lượng sản phẩm không đủ.');
            return;
        }

        dispatch(addToCartWithQuantity({ product: currentProduct, quantity }));

        setIsAddedToCart(true);
        setTimeout(() => {
            setIsAddedToCart(false);
        }, 3000);
    }, [dispatch, currentProduct, quantity]);

    return useMemo(() => ({
        id,
        currentProduct,
        isLoading,
        error,
        quantity,
        setQuantity,
        handleAddToCart,
        isAddedToCart,
        errorAdd,
    }), [
        id,
        currentProduct,
        isLoading,
        error,
        quantity,
        setQuantity,
        handleAddToCart,
        isAddedToCart,
        errorAdd,
    ]);
}