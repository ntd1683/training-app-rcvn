import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCartItems,
    selectCartTotalAmount,
} from '~/redux/selectors/cart-selector';
import { updateCartItemQuantity, deleteFromCart } from '~/redux/slices/cart-slice';

export const useCart = () => {
    // Todo: Implement fee logic if needed
    // eslint-disable-next-line
    const [fee, setFee] = React.useState(0);

    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const totalAmount = useSelector(selectCartTotalAmount);

    const handleQuantityChange = useCallback((itemId, newQuantity) => {
        dispatch(updateCartItemQuantity({ id: itemId, quantity: newQuantity }));
    }, [dispatch]);

    const handleDeleteItem = useCallback((itemId) => {
        dispatch(deleteFromCart(itemId));
    }, [dispatch]);

    return useMemo(() => ({
        cartItems,
        totalAmount,
        fee,
        handleQuantityChange,
        handleDeleteItem
    }), [cartItems, totalAmount, fee, handleQuantityChange, handleDeleteItem]);
}