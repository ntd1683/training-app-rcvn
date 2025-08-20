import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistCount, selectWishlistItems } from '~/redux/selectors/wish-list-selector';
import { removeFromWishlist } from '~/redux/slices/wishlist-slice';

export const useWishlist = () => {
    const dispatch = useDispatch();
    const wishlistItems = useSelector(selectWishlistItems);
    const countWishlistItems = useSelector(selectWishlistCount);

    const handleDeleteItem = useCallback((itemId) => {
        dispatch(removeFromWishlist(itemId));
    }, [dispatch]);

    return useMemo(() => ({
        wishlistItems,
        handleDeleteItem,
        countWishlistItems
    }), [wishlistItems, handleDeleteItem, countWishlistItems]);
}