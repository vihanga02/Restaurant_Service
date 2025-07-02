import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const FoodDetails = () => {
    const { id } = useParams(); // Get the food ID from the route params
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/foods/${id}`);
                setFood(response.data);
            } catch (err) {
                console.error('Error fetching food details:', err);
            }
        };
        fetchFoodDetails();
    }, [id]);

    useEffect(() => {
        const checkLoginAndFavorite = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/customers/navbar', { withCredentials: true });
                if (response.data && response.data.success === true) {
                    setIsLoggedIn(true);
                    console.log(isLoggedIn)
                    // Check if this food is in user's favorites
                    const favRes = await axios.get('http://localhost:8000/api/customers/favorites', { withCredentials: true });
                    if (favRes.data.favorites && favRes.data.favorites.some(fav => fav._id === id)) {
                        setIsFavorite(true);
                    } else {
                        setIsFavorite(false);
                    }
                } else {
                    setIsLoggedIn(false);
                    setIsFavorite(false);
                }
            } catch (err) {
                setIsLoggedIn(false);
                setIsFavorite(false);
            }
        };
        checkLoginAndFavorite();
    }, [id]);

    const toUpperCaseAll = (str) => {
        return str.toUpperCase();
    };

    const handleAddToCart = () => {
        axios.post("http://localhost:8000/api/orders/", {foodId: id, quantity} , { withCredentials: true})
            .then((response) => {
                toast.success('Food added to cart successfully!');
            })
            .catch((err) => {
                console.error("Error adding food to cart:", err);
                toast.error("Failed to add food to cart.");
            });
    };

    const handleQuantityChange = (change) => {
        setQuantity((prev) => Math.max(1, prev + change));
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (!isLoggedIn) return;
        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:8000/api/customers/favorites/${id}`, { withCredentials: true });
                setIsFavorite(false);
                toast.info('Removed from favorites');
            } else {
                await axios.post(`http://localhost:8000/api/customers/favorites`, { foodId: id }, { withCredentials: true });
                setIsFavorite(true);
                toast.success('Added to favorites!');
            }
        } catch (err) {
            toast.error('Failed to update favorites');
        }
    };

    if (!food) {
        return <div className="text-center text-gray-600 mt-20">Loading food details...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8 mt-20">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 px-14 ">
                <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-full object-cover"
                />
                <div className="p-6 bg-white/30 backdrop-blur-md border border-white/40 rounded-lg shadow-lg">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-bold text-yellow-600 mt-16">{toUpperCaseAll(food.name)}</h1>
                        {isLoggedIn && (
                            <button
                                className="text-red-500 text-2xl mt-16 hover:scale-110 transition-transform"
                                onClick={handleFavoriteClick}
                                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                            </button>
                        )}
                    </div>
                    <p className="text-gray-700 my-10 text-justify">{food.description}</p>
                    <div className='flex justify-between items-center space-x-4 mb-6'>
                        <p className="text-2xl font-bold text-yellow-700 mb-4 ">LKR {food.price}</p>
                        <div className="flex items-center space-x-4 mb-6">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            >
                                -
                            </button>
                            <span className="text-xl font-bold">{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-700 transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetails;
