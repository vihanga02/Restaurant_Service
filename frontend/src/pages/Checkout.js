import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RgTw3QhnsyWQBjMDCGjCwaEUrW9EpBb6gZalf4ANbCR9ZKklG05wgoiGAGCKQTJmcTA58MjRa90zmeIcqN5wvki00lHq0ThY7'); // Replace with your Stripe publishable key

const CheckoutForm = ({ orderId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        if (!stripe || !elements) {
            setError('Stripe has not loaded');
            setLoading(false);
            return;
        }
        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, token } = await stripe.createToken(cardElement);
        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }
        try {
            // Send token to backend to process payment and mark order as paid
            const response = await fetch(`http://localhost:8000/api/orders/paid/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardToken: token.id }),
                credentials: 'include',
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Payment failed');
            }
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Card Details</label>
                <div className="border rounded-lg p-2 bg-white">
                    <CardElement options={{ hidePostalCode: true }} />
                </div>
            </div>
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}
            {success && <div className="text-green-600 text-center mb-4">Payment successful!</div>}
            <button type="submit" disabled={loading} className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

const Checkout = (props) => {
    // You can get orderId from props, location state, or URL params
    const orderId = props.orderId || new URLSearchParams(window.location.search).get('orderId');
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
        </Elements>
    );
};

export default Checkout; 