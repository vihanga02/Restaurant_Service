import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import '@fortawesome/fontawesome-free/css/all.min.css';


const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Use environment variables for EmailJS
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: process.env.REACT_APP_CONTACT_EMAIL
                },
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            // Clear status after 3 seconds
            setTimeout(() => setSubmitStatus(''), 3000);
        }
    };

    return (
        <div className="mt-5 min-h-screen bg-gray-50" style={{ backgroundImage: `url(${require('../assets/background1.jpg')})` }}>
            <div className="mx-auto px-44 py-16 bg-white/50">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-orange-700 mb-2">Contact Us</h1>
                    <p className="text-gray-600 text-lg">
                        Have a question or feedback? We'd love to hear from you!
                    </p>
                </div>

                {/* Contact Details and Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/40 p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-orange-700 mb-4">Our Contact Details</h2>
                        <p className="text-gray-600 mb-6">
                            Feel free to reach out to us using the information below.
                        </p>
                        <ul className="space-y-4">
                            <li>
                                <i className="fas fa-phone text-orange-500 mr-3"></i>
                                <span className="text-gray-700">+123 456 789</span>
                            </li>
                            <li>
                                <i className="fas fa-envelope text-orange-500 mr-3"></i>
                                <span className="text-gray-700">info@pizzashop.com</span>
                            </li>
                            <li>
                                <i className="fas fa-map-marker-alt text-orange-500 mr-3"></i>
                                <span className="text-gray-700">
                                    123 Pizza Street, Food City, 45678
                                </span>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-orange-700 mb-2">Follow Us</h3>
                            <div className="flex space-x-4 text-gray-600">
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <i className="fab fa-facebook fa-2x"></i>
                                </a>
                                <a
                                    href="https://www.twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <i className="fab fa-twitter fa-2x"></i>
                                </a>
                                <a
                                    href="https://www.instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <i className="fab fa-instagram fa-2x"></i>
                                </a>
                                <a
                                    href="https://www.youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-orange-500 transition-colors"
                                >
                                    <i className="fab fa-youtube fa-2x"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/40 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-orange-700 mb-4">Send Us a Message</h2>
                        
                        {/* Status Messages */}
                        {submitStatus === 'success' && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                Message sent successfully! We'll get back to you soon.
                            </div>
                        )}
                        {submitStatus === 'error' && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                Failed to send message. Please try again.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-white/50 rounded-lg bg-white/40 focus:outline-none focus:ring focus:ring-orange-200"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-white/50 rounded-lg bg-white/40 focus:outline-none focus:ring focus:ring-orange-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="message"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-white/50 rounded-lg bg-white/40 focus:outline-none focus:ring focus:ring-orange-200"
                                    placeholder="Enter your message"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
