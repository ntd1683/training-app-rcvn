import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentProduct, selectCurrentProductLoading, selectCurrentProductError } from '~/redux/selectors/products-selector';
import { loadProduct } from '~/redux/slices/products-slice';

export const useProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = React.useState(1);

    const dispatch = useDispatch();
    const currentProduct = useSelector(selectCurrentProduct);
    const isLoading = useSelector(selectCurrentProductLoading);
    const error = useSelector(selectCurrentProductError);

    useEffect(() => {
        if (id) {
            dispatch(loadProduct(id));
        }
    }, [dispatch, id]);

    return useMemo(() => ({
        id,
        currentProduct,
        isLoading,
        error,
        quantity,
        setQuantity,
    }), [id, currentProduct, isLoading, error, quantity, setQuantity]);
}