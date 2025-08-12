import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    setQuery,
    setIsOpen,
    searchProductsAsync,
    clearResults,
    addRecentSearch
} from '~/redux/slices/search-slice';

export const useSearchAlgolia = (options = {}) => {
    const { isMobile = false, toggleMobileSearch } = options;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [localQuery, setLocalQuery] = useState('');
    const searchRefDesktop = useRef(null);
    const searchRefMobile = useRef(null);
    const timeoutRef = useRef(null);
    const toggleMobileSearchRef = useRef(toggleMobileSearch);
    useEffect(() => {
        toggleMobileSearchRef.current = toggleMobileSearch;
    }, [toggleMobileSearch]);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            dispatch(setQuery(localQuery));
            if (localQuery.trim()) {
                dispatch(searchProductsAsync(localQuery));
            } else {
                dispatch(clearResults());
            }
        }, 300);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [localQuery, dispatch]);

    const handleFocus = useCallback(() => {
        dispatch(setIsOpen(true));
    }, [dispatch]);

    const handleInputChange = useCallback((e) => {
        setLocalQuery(e.target.value);
    }, []);

    const handleSearchClick = useCallback(() => {
        if (localQuery.trim()) {
            dispatch(addRecentSearch(localQuery));
            dispatch(setIsOpen(false));

            if (isMobile && toggleMobileSearchRef.current) {
                toggleMobileSearchRef.current();
            }

            navigate(`/shop?name=${encodeURIComponent(localQuery)}`);
        }
    }, [localQuery, dispatch, navigate, isMobile]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    }, [handleSearchClick]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile) {
                if (!searchRefMobile.current) return;
                const mobileOverlay = document.querySelector('.mobile-search-overlay');
                const closeButton = event.target.closest('.close-search');

                if (closeButton) return;

                if (mobileOverlay && event.target === mobileOverlay) {
                    dispatch(setIsOpen(false));
                    if (toggleMobileSearchRef.current) {
                        toggleMobileSearchRef.current();
                    }
                    return;
                }

                if (mobileOverlay &&
                    mobileOverlay.contains(event.target) &&
                    !searchRefMobile.current.contains(event.target)) {

                    dispatch(setIsOpen(false));
                    return;
                }
            } else {
                const mobileOverlay = document.querySelector('.mobile-search-overlay');
                if (mobileOverlay) return;

                if (!searchRefDesktop.current.contains(event.target)) {
                    dispatch(setIsOpen(false));
                }
            }
        };

        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, isMobile ? 100 : 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dispatch, isMobile]);

    return {
        localQuery,
        setLocalQuery,
        handleFocus,
        handleInputChange,
        handleSearchClick,
        handleKeyPress,
        searchRefDesktop,
        searchRefMobile
    }
}