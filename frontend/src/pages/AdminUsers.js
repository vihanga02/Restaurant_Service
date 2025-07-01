import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/customers";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Remove user
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      setError("Failed to remove user");
    }
  };

  // View user details
  const handleView = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-10 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-orange-700 mb-8">User Management</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/40">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">
                    <button
                      className="mr-2 px-3 py-1 bg-yellow-500/80 text-white rounded hover:bg-yellow-600"
                      onClick={() => handleView(user)}
                    >
                      View
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      onClick={() => handleRemove(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for User Details */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={closeModal}>&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-orange-700">User Details</h3>
            <div className="space-y-2">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Phone:</strong> {selectedUser.phone}</div>
              <div><strong>Address:</strong> {selectedUser.address}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;