import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import pizzaImage from "../assets/navbar-pizza.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Import Font Awesome icon

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/customers/navbar', { withCredentials: true });
                if (response.data.success) {
                    setIsLoggedIn(true);
                    // Fetch pending order count if logged in
                    fetchPendingOrderCount();
                }
            } catch (err) {
                console.error(err);
            }
        };

        const fetchPendingOrderCount = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/orders/pending/count', { withCredentials: true });
                setPendingCount(response.data.count || 0);
            } catch (err) {
                setPendingCount(0);
            }
        };

        checkLogin();
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/profile'); // Redirect to the profile page
    };

    return (
        <nav className="bg-white/30 backdrop-blur-md border-b border-white/40 text-orange-500 p-4 fixed top-0 w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link to="/" className="text-xl font-black flex items-center">La Pizzeria</Link>
                    <div>
                        <img src={pizzaImage} alt="pizza" className="w-10 h-10 ml-2" />
                    </div>
                </div>
                <div className="flex space-x-28">
                    <Link to="/" className="hover:font-bold font-semibold mx-5 text-xl">
                        Home
                    </Link>
                    <Link to="/menu" className="hover:font-bold font-semibold mx-8 text-xl">
                        Menu
                    </Link>
                    <Link to="/contact" className="hover:font-bold font-semibold mx-5 text-xl">
                        Contact
                    </Link>
                </div>
                <div>
                    {isLoggedIn ? (
                        <div
                            className="relative cursor-pointer text-orange-500 hover:text-orange-600 transition"
                            onClick={handleProfileClick}
                        >
                            <FaUserCircle size={36} /> {/* Profile icon */}
                            {pendingCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={handleLogin} 
                            className="text-yellow-50 font-black bg-yellow-500 py-2 px-5 rounded-3xl border-yellow-600 hover:bg-yellow-400"
                        >
                            LOG IN
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
