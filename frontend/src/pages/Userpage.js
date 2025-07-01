import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerOrders = () => {
    const [customerDetails, setCustomerDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                // Fetch customer details
                axios
                    .get("http://localhost:8000/api/customers/profile", { withCredentials: true })
                    .then((response) => {
                        setCustomerDetails(response.data.customer);
                    })
                    .catch((err) => {
                        console.error("Error fetching customer data:", err);
                        setError("Failed to load data. Please try again later.");
                    });

                // Fetch customer orders
                axios
                    .get(`http://localhost:8000/api/orders/customer/`, { withCredentials: true })
                    .then((response1) => {
                        // Filter orders with status "Paid" or "Pending"
                        const filteredOrders = response1.data.filter(
                            (order) => order.status === "Paid" || order.status === "Pending"
                        );
                        setOrders(filteredOrders);
                    })
                    .catch((err) => {
                        console.error("Error fetching customer orders:", err);
                        setError("Failed to load data. Please try again later.");
                    });

                setLoading(false);
            } catch (err) {
                console.error("Error fetching customer data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, []);

    const handleCheckout = async (orderId) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/orders/paid/${orderId}`,
                {},
                { withCredentials: true }
            );

            toast.success("Checkout successful!");
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: "Paid" } : order
                )
            );
        } catch (err) {
            console.error("Error during checkout:", err);
            toast.error("Failed to complete checkout. Please try again.");
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/orders/cancel/${orderId}`,
                { withCredentials: true }
            );

            toast.info("Order canceled successfully!");
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } catch (err) {
            console.error("Error during order cancellation:", err);
            toast.error("Failed to cancel order. Please try again.");
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-20">
            {/* Toast Notification */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Customer Details */}
            {customerDetails && (
                <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-md rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                    <h2 className="text-4xl text-center font-bold text-orange-600 mb-4">Your Details</h2>
                    <p className="text-gray-800 mb-3">
                        <strong>Name:</strong> {customerDetails.name}
                    </p>
                    <p className="text-gray-800 mb-3">
                        <strong>Email:</strong> {customerDetails.email}
                    </p>
                    <p className="text-gray-800 mb-3">
                        <strong>Phone:</strong> {customerDetails.phone}
                    </p>
                    <p className="text-gray-800 mb-3">
                        <strong>Address:</strong> {customerDetails.address}
                    </p>
                </div>
            )}

            {/* Orders */}
            <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto">
                <h2 className="text-4xl text-center font-bold text-orange-600 mb-8">Current Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-600">No orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="flex flex-col md:flex-row justify-between border-b pb-4"
                            >
                                {/* Left Section: Order Details and Buttons */}
                                <div className="md:w-1/2">
                                    <h3 className="text-lg font-semibold text-yellow-600 mb-4">
                                        Order ID: {order._id}
                                    </h3>
                                    <p className="text-gray-800 mb-3">
                                        <strong>Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}
                                    </p>
                                    <p className="text-gray-800 mb-3">
                                        <strong>Status:</strong> {order.status}
                                    </p>
                                    <p className="text-gray-800 mb-3">
                                        <strong>Total Price:</strong> LKR {order.totalPrice.toFixed(2)}
                                    </p>
                                </div>

                                {/* Right Section: Food Items */}
                                <div className="md:w-1/2 mt-6 md:mt-0 md:ml-8">
                                    <h4 className="text-3xl font-semibold text-orange-800 mb-4">Food Items</h4>
                                    <ul className="list-disc ml-6">
                                        {order.foodItems.map((item, index) => (
                                            <li key={index} className="text-gray-800">
                                                {item.item.name} - {item.quantity} pcs
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-start mt-8">
                                        {order.status === "Pending" && (
                                            <div className="space-x-4">
                                                <button
                                                    onClick={() => handleCheckout(order._id)}
                                                    className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition"
                                                >
                                                    Checkout
                                                </button>
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="px-4 py-2 bg-gray-300 text-white font-bold rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;
