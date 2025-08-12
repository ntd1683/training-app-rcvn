import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export const PayPalButton = ({
    handleCreateOrder,
    handleApproveOrder,
    handleCancelOrder,
    handleErrorOrder,
    className
}) => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    return (
        <PayPalScriptProvider options={{ 'client-id': clientId, 'currency': 'USD', 'vault': true }}>
            <PayPalButtons className={className}
                createOrder={handleCreateOrder}
                onApprove={handleApproveOrder}
                onCancel={handleCancelOrder}
                onError={handleErrorOrder}
            />
        </PayPalScriptProvider>
    );
};