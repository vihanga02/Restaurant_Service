import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


const ContactUs = () => {
    return (
        <div className="mt-5 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-16">
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
                    <div className="bg-white p-8 rounded-lg shadow-md">
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
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-orange-700 mb-4">Send Us a Message</h2>
                        <form>
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
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-200"
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
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-200"
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
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-orange-200"
                                    placeholder="Enter your message"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
