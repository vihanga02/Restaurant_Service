import React, { useState } from 'react';
import image from '../assets/signup.jpg';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX'); // Replace with your Stripe publishable key

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        repassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setError('Invalid email format');
            return;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Phone number must be 10 digits');
            return;
        }
        if (formData.password !== formData.repassword) {
            setError('Passwords do not match');
            return;
        }

        if (!stripe || !elements) {
            setError('Stripe has not loaded');
            return;
        }

        // Create Stripe token
        const cardElement = elements.getElement(CardElement);
        const { error: stripeError, token } = await stripe.createToken(cardElement);
        if (stripeError) {
            setError(stripeError.message);
            return;
        }

        try {
            const { repassword, ...dataToSend } = formData;
            const response = await fetch('http://localhost:8000/api/customers/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...dataToSend, cardToken: token.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative bg-gray-50 min-h-screen flex items-center justify-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{
                    backgroundImage: `url(${image})`,
                }}
            ></div>

            {/* Content */}
            <div className="relative bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-8 max-w-md w-full z-10">
                <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-red-600 text-center mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-600 text-center mb-4">
                            Registration successful! You can now{' '}
                            <a href="/login" className="text-yellow-600 font-bold">Login</a>.
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="repassword" className="block text-gray-700 font-bold mb-2">
                            Re-Enter Password
                        </label>
                        <input
                            type="password"
                            id="repassword"
                            name="repassword"
                            value={formData.repassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Card Details</label>
                        <div className="border rounded-lg p-2 bg-white">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Already have an account? <a href="/login" className="text-yellow-600 font-bold">Login</a>
                </p>
            </div>
        </div>
    );
};

const Signup = () => (
    <Elements stripe={stripePromise}>
        <SignupForm />
    </Elements>
);

export default Signup;
