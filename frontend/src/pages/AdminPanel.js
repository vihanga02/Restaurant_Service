import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-12 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-orange-700 mb-8">Admin Panel</h1>
        <div className="flex flex-col gap-6 w-full">
          <Link to="/admin/users" className="w-full text-center py-4 bg-yellow-500/80 text-white font-bold rounded-lg shadow hover:bg-yellow-600 transition">User Management</Link>
          <Link to="/admin/orders" className="w-full text-center py-4 bg-yellow-500/80 text-white font-bold rounded-lg shadow hover:bg-yellow-600 transition">Order Management</Link>
          <Link to="/admin/foods" className="w-full text-center py-4 bg-yellow-500/80 text-white font-bold rounded-lg shadow hover:bg-yellow-600 transition">Food Management</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 