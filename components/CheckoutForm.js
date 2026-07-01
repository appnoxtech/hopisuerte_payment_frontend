'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm({ amount, currency, successRedirectUrl, paymentId, isSetupIntent }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        let returnUrl;
        if (successRedirectUrl) {
            const separator = successRedirectUrl.includes('?') ? '&' : '?';
            returnUrl = `${successRedirectUrl}${separator}transactionId=${paymentId || ''}`;
        } else {
            returnUrl = window.location.origin + '/success';
        }

        let error;
        if (isSetupIntent) {
            const result = await stripe.confirmSetup({
                elements,
                confirmParams: {
                    return_url: returnUrl,
                },
            });
            error = result.error;
        } else {
            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl,
                },
            });
            error = result.error;
        }

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button
                id="submit"
                disabled={isLoading || !stripe || !elements}
                style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: 20,
                    background: '#0070E0',
                    color: '#FFFFFF',
                    borderRadius: 14,
                    border: 'none',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    cursor: 'pointer',
                    fontSize: 15,
                    opacity: isLoading || !stripe || !elements ? 0.5 : 1,
                    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
                    transition: 'all 0.2s ease'
                }}
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : `Complete Payment`}
                </span>
            </button>
            {message && <div id="payment-message" style={{ color: '#EF4444', marginTop: '1rem', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>{message}</div>}
        </form>
    );
}
