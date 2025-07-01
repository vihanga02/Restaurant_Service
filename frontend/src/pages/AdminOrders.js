import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/admin/orders";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mark order as complete
  const handleComplete = async (id) => {
    if (!window.confirm("Are you sure you want to mark this order as complete?")) return;
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: "Complete" });
      fetchOrders();
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-10 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-orange-700 mb-8">Order Management</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Ordered At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/40">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.customerName} <br /> {order.email}</td>
                  <td className="px-4 py-2">LKR {order.totalPrice}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{new Date(order.orderedAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {order.status !== "Complete" && (
                      <button
                        className="px-3 py-1 bg-green-500/80 text-white rounded hover:bg-green-600"
                        onClick={() => handleComplete(order._id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;