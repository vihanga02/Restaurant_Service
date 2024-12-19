import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import pizzaImage from "../assets/navbar-pizza.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/customers/navbar', {withCredentials: true});
                if (response.data.success) {
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error(err);
            }
        };

        checkLogin();
    }, []);

    const handleLogin = async () => {
        navigate('/login');
        setIsLoggedIn(true);
    }

    return (
        <nav className="bg-white text-orange-500 p-4 fixed top-0 w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-black flex items-center">La Pizzeria </Link>
                    <div><img src={pizzaImage} alt="pizza" className="w-10 h-10 " /></div>
                </div>
                <div>
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
                        <Link to="/orders" className="text-yellow-50 font-black bg-yellow-500 py-2 px-5 rounded-3xl border-yellow-600 hover:bg-yellow-400">
                            ORDERS
                        </Link>
                    ) : (
                        <button 
                            onClick={() => handleLogin()} 
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
