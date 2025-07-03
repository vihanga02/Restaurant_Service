import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51RgTw3QhnsyWQBjMDCGjCwaEUrW9EpBb6gZalf4ANbCR9ZKklG05wgoiGAGCKQTJmcTA58MjRa90zmeIcqN5wvki00lHq0ThY7');

const CheckoutForm = ({ orderId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [order, setOrder] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [useSavedCard, setUseSavedCard] = useState(false);
    const [cardholderName, setCardholderName] = useState('');
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        // Fetch order details
        axios.get(`http://localhost:8000/api/orders/${orderId}`, { withCredentials: true })
            .then(res => setOrder(res.data))
            .catch(() => setOrder(null));
        // Fetch customer payment info
        axios.get('http://localhost:8000/api/customers/payment-info', { withCredentials: true })
            .then(res => setPaymentInfo(res.data))
            .catch(() => setPaymentInfo(null));
    }, [orderId]);

    const elementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '10px 12px',
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        if (useSavedCard && paymentInfo && paymentInfo.cardLast4) {
            // Handle saved card payment
            try {
                const response = await fetch(`http://localhost:8000/api/orders/paid/${orderId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cardToken: 'use_saved_card' }),
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
            return;
        }

        // Validate cardholder name
        if (!cardholderName.trim()) {
            setNameError('Cardholder name is required');
            setLoading(false);
            return;
        }

        if (!stripe || !elements) {
            setError('Stripe has not loaded');
            setLoading(false);
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);

        try {
            // Create payment method instead of token
            const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
                billing_details: {
                    name: cardholderName,
                },
            });

            if (paymentError) {
                setError(paymentError.message);
                setLoading(false);
                return;
            }

            // Send payment method to backend
            const response = await fetch(`http://localhost:8000/api/orders/paid/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    paymentMethodId: paymentMethod.id,
                    cardholderName: cardholderName 
                }),
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

    const handleNameChange = (e) => {
        setCardholderName(e.target.value);
        if (nameError) {
            setNameError('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>
            
            {/* Order Details */}
            {order && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">Order Details</h3>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Price:</strong> LKR {order.totalPrice.toFixed(2)}</p>
                    <ul className="list-disc ml-6 mt-2">
                        {order.foodItems.map((item, idx) => (
                            <li key={idx}>{item.item.name} - {item.quantity} pcs</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Saved Card Option */}
            {paymentInfo && paymentInfo.cardLast4 && (
                <div className="mb-4 p-4 bg-gray-100 rounded">
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={useSavedCard}
                            onChange={() => setUseSavedCard(!useSavedCard)}
                            id="useSavedCard"
                            className="mr-2"
                        />
                        <label htmlFor="useSavedCard" className="text-gray-700">
                            Use saved card: {paymentInfo.cardBrand} **** **** **** {paymentInfo.cardLast4} 
                            (exp {paymentInfo.cardExpMonth}/{paymentInfo.cardExpYear})
                        </label>
                    </div>
                </div>
            )}
            
            {/* Card Details Form */}
            {!useSavedCard && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">Payment Information</h3>
                    
                    {/* Cardholder Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            value={cardholderName}
                            onChange={handleNameChange}
                            placeholder="John Doe"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                                nameError ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {nameError && (
                            <p className="text-red-500 text-sm mt-1">{nameError}</p>
                        )}
                    </div>
                    
                    {/* Card Number */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Card Number
                        </label>
                        <div className="border rounded-lg p-2 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                            <CardNumberElement options={elementOptions} />
                        </div>
                    </div>
                    
                    {/* Expiry and CVC */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Expiry Date
                            </label>
                            <div className="border rounded-lg p-2 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                                <CardExpiryElement options={elementOptions} />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                CVC
                            </label>
                            <div className="border rounded-lg p-2 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                                <CardCvcElement options={elementOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {error && <div className="text-red-600 text-center mb-4 p-2 bg-red-50 rounded">{error}</div>}
            {success && <div className="text-green-600 text-center mb-4 p-2 bg-green-50 rounded">Payment successful!</div>}
            
            <button 
                type="submit" 
                disabled={loading || (!stripe && !useSavedCard)} 
                className="w-full bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : `Pay LKR ${order?.totalPrice?.toFixed(2) || '0.00'}`}
            </button>
        </form>
    );
};

const Checkout = (props) => {
    const orderId = props.orderId || new URLSearchParams(window.location.search).get('orderId');
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm orderId={orderId} />
        </Elements>
    );
};

export default Checkout;