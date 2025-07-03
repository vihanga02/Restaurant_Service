import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const CustomerOrders = () => {
    const [customerDetails, setCustomerDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                // Fetch customer details
                axios
                    .get("http://localhost:8000/api/customers/profile", { withCredentials: true })
                    .then((response) => {
                        setCustomerDetails(response.data.customer);
                        setEditPhone(response.data.customer.phone || "");
                        setEditAddress(response.data.customer.address || "");
                    })
                    .catch((err) => {
                        console.error("Error fetching customer data:", err);
                        setError("Failed to load data. Please try again later.");
                    });

                // Fetch customer favorites
                axios
                    .get("http://localhost:8000/api/customers/favorites", { withCredentials: true })
                    .then((responseFav) => {
                        setFavorites(responseFav.data.favorites || []);
                    })
                    .catch((err) => {
                        console.error("Error fetching favorites:", err);
                        setError("Failed to load favorites. Please try again later.");
                    });

                // Fetch first page of orders
                const response1 = await axios.get(`http://localhost:8000/api/orders/customer/paginated?page=1&limit=3`, { withCredentials: true });
                const filteredOrders = response1.data.orders.filter(
                    (order) => order.status === "Paid" || order.status === "Pending"
                );
                setOrders(filteredOrders);
                setTotalOrders(response1.data.totalOrders);
                setPage(1);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching customer data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, []);

    const handleCheckout = (orderId) => {
        navigate(`/checkout?orderId=${orderId}`);
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

    const handleLoadMore = async () => {
        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await axios.get(`http://localhost:8000/api/orders/customer/paginated?page=${nextPage}&limit=3`, { withCredentials: true });
            const filteredOrders = response.data.orders.filter(
                (order) => order.status === "Paid" || order.status === "Pending"
            );
            setOrders((prev) => [...prev, ...filteredOrders]);
            setPage(nextPage);
        } catch (err) {
            setError("Failed to load more orders. Please try again later.");
        }
        setLoading(false);
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditPhone(customerDetails.phone || "");
        setEditAddress(customerDetails.address || "");
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.patch(
                "http://localhost:8000/api/customers/profile",
                { phone: editPhone, address: editAddress },
                { withCredentials: true }
            );
            setCustomerDetails((prev) => ({ ...prev, phone: editPhone, address: editAddress }));
            setEditing(false);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/customers/logout", {}, { withCredentials: true });
        } catch (err) {
            // Even if logout fails, clear session and redirect
        }
        navigate("/login");
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-white-50 p-8 pt-20 bg-yellow-50/10">
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
                    <p className="text-gray-800 mb-3 flex items-center">
                        <strong>Phone:</strong>
                        {editing ? (
                            <input
                                type="text"
                                className="ml-2 border rounded px-2 py-1"
                                value={editPhone}
                                onChange={e => setEditPhone(e.target.value)}
                            />
                        ) : (
                            <span className="ml-2">{customerDetails.phone}</span>
                        )}
                    </p>
                    <p className="text-gray-800 mb-3 flex items-center">
                        <strong>Address:</strong>
                        {editing ? (
                            <input
                                type="text"
                                className="ml-2 border rounded px-2 py-1 w-full"
                                value={editAddress}
                                onChange={e => setEditAddress(e.target.value)}
                            />
                        ) : (
                            <span className="ml-2">{customerDetails.address}</span>
                        )}
                    </p>
                    <div className="flex gap-4 mt-4">
                        {editing ? (
                            <>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-yellow-500/60 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition ml-auto"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Favorite Items */}
            <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-md rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                <h2 className="text-3xl text-center font-bold text-orange-500 mb-4">Your Favorite Items</h2>
                {favorites.length === 0 ? (
                    <p className="text-gray-600 text-center">No favorite items found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {favorites.map((item) => (
                            <div key={item._id}>
                                {/* Use FoodCard for each favorite item */}
                                {/* FoodCard expects 'item' prop */}
                                {React.createElement(require('../components/FoodCard').default, { item })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                        {orders.length < totalOrders && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;
