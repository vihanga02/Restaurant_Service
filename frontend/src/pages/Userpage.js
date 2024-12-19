import axios from "axios";
import React, { useEffect, useState } from "react";

const CustomerOrders = () => {
    const [customerDetails, setCustomerDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                // Replace these API endpoints with your backend routes
                axios.get("http://localhost:8000/api/customers/profile", { withCredentials: true })
                    .then((response) => {    
                        console.log(response.data);
                        setCustomerDetails(response.data.customer);
                    })
                    .catch((err) => {
                        console.error("Error fetching customer data:", err);
                        setError("Failed to load data. Please try again later.");
                    });

                // const ordersResponse = await fetch("http://localhost:8000/api/orders", {
                //     method: "GET",
                //     credentials: "include",
                // });

                // if (!customerResponse.ok || !ordersResponse.ok) {
                //     throw new Error("Failed to fetch data");
                // }

                // setCustomerDetails(customerData);
                // setOrders(ordersData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching customer data:", err);
                setError("Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-bold text-center text-yellow-600 mb-6">My Account</h1>

            {/* Customer Details */}
            {customerDetails && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-orange-600 mb-4">Customer Details</h2>
                    <p className="text-gray-800">
                        <strong>Name:</strong> {customerDetails.name}
                    </p>
                    <p className="text-gray-800">
                        <strong>Email:</strong> {customerDetails.email}
                    </p>
                    <p className="text-gray-800">
                        <strong>Phone:</strong> {customerDetails.phone}
                    </p>
                    <p className="text-gray-800">
                        <strong>Address:</strong> {customerDetails.address}
                    </p>
                </div>
            )}

            {/* Orders */}
            <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-orange-600 mb-4">Current Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-600">No orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border-b pb-4">
                                <h3 className="text-lg font-semibold text-yellow-600">
                                    Order ID: {order._id}
                                </h3>
                                <p className="text-gray-800">
                                    <strong>Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}
                                </p>
                                <p className="text-gray-800">
                                    <strong>Status:</strong> {order.status}
                                </p>
                                <p className="text-gray-800">
                                    <strong>Total Price:</strong> LKR {order.totalPrice.toFixed(2)}
                                </p>

                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-700">Food Items:</h4>
                                    <ul className="list-disc ml-6">
                                        {order.foodItems.map((item, index) => (
                                            <li key={index} className="text-gray-800">
                                                {item.item.name} - {item.quantity} pcs
                                            </li>
                                        ))}
                                    </ul>
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
