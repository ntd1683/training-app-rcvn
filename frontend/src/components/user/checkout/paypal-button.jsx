import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export const PayPalButton = ({ handleCreateOrder, handleApproveOrder, handleCancelOrder, handleErrorOrder }) => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    return (
        <PayPalScriptProvider options={{ 'client-id': clientId, 'currency': 'USD', 'vault': true }}>
            <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApproveOrder}
                onCancel={handleCancelOrder}
                onError={handleErrorOrder}
            />
        </PayPalScriptProvider>
    );
};