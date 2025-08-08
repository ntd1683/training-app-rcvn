import { useSelector } from 'react-redux';

export const usePersistStatus = () => {
  const cartPersistState = useSelector(state => state._persist);
  const isRehydrated = cartPersistState?.rehydrated || false;
  
  return {
    isRehydrated,
    isLoading: !isRehydrated
  };
};