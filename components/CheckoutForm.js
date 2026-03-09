'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm({ amount, currency }) {
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

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/success',
            },
        });

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
                    background: '#facc15',
                    color: '#000',
                    borderRadius: 14,
                    border: 'none',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    cursor: 'pointer',
                    fontSize: 15,
                    opacity: isLoading || !stripe || !elements ? 0.5 : 1
                }}
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : `Complete Payment`}
                </span>
            </button>
            {message && <div id="payment-message" style={{ color: 'var(--error)', marginTop: '1rem' }}>{message}</div>}
        </form>
    );
}
