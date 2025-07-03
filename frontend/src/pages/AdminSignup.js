import React, { useState } from 'react';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        repassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        if (formData.password !== formData.repassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const { repassword, ...dataToSend } = formData;
            const response = await fetch('http://localhost:8000/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-yellow-600 mb-6">Admin Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-600 text-center mb-4">{error}</div>}
                    {success && <div className="text-green-600 text-center mb-4">Registration successful! You can now <a href="/login" className="text-yellow-600 font-bold">Login</a>.</div>}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="repassword" className="block text-gray-700 font-bold mb-2">Re-Enter Password</label>
                        <input type="password" id="repassword" name="repassword" value={formData.repassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600" required />
                    </div>
                    <button type="submit" className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">Sign Up</button>
                </form>
                <p className="text-center text-gray-600 mt-4">Already have an account? <a href="/login" className="text-yellow-600 font-bold">Login</a></p>
            </div>
        </div>
    );
};

export default AdminSignup; 