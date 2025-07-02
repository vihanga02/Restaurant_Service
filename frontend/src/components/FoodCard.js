import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const FoodCard = ({ item, onAddToCart }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkLoginAndFavorite = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/customers/navbar', { withCredentials: true });
                if (response.data && response.data.success === true) {
                    setIsLoggedIn(true);
                    // Check if this food is in user's favorites
                    const favRes = await axios.get('http://localhost:8000/api/customers/favorites', { withCredentials: true });
                    if (favRes.data.favorites && favRes.data.favorites.some(fav => fav._id === item._id)) {
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
        // eslint-disable-next-line
    }, [item._id]);

    const capitalizeName = (name) => {
        return name.replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleCardClick = () => {
        navigate(`/food-details/${item._id}`); 
    };

    const handleAddToCart = () => {
        axios.post("http://localhost:8000/api/orders/", { foodId: item._id, quantity: 1 }, { withCredentials: true })
            .then((response) => {
                toast.success('Food added to cart successfully!');
            })
            .catch((err) => {
                console.error("Error adding food to cart:", err);
                toast.error("Failed to add food to cart.");
            });
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (!isLoggedIn) return;
        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:8000/api/customers/favorites/${item._id}`, { withCredentials: true });
                setIsFavorite(false);
                toast.info('Removed from favorites');
            } else {
                await axios.post(`http://localhost:8000/api/customers/favorites`, { foodId: item._id }, { withCredentials: true });
                setIsFavorite(true);
                toast.success('Added to favorites!');
            }
        } catch (err) {
            toast.error('Failed to update favorites');
        }
    };

    return (
        <div
            className="bg-gray-50/20 rounded-lg shadow-xl p-4 text-center hover:shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer relative"
            onClick={handleCardClick}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Heart Icon for Favorites */}
            {isLoggedIn && (
                <button
                    className="absolute top-3 right-3 text-red-500 text-2xl z-10 hover:scale-110 transition-transform"
                    onClick={handleFavoriteClick}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>
            )}
            <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-60 object-cover rounded"
            />
            <h3 className="text-xl font-bold mt-2">{capitalizeName(item.name)}</h3>
            {/* Star Rating Display */}
            <div className="flex items-center justify-center mt-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.round(item.starRating) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                ))}
                <span className="ml-2 text-sm text-gray-600">{item.starRating ? item.starRating.toFixed(1) : '0.0'} ({item.numReviews || 0})</span>
            </div>
            <p className="text-yellow-600 font-bold">LKR {item.price}</p>
            <button
                onClick={(e) => {
                    e.stopPropagation(); 
                    handleAddToCart();
                }}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700 transition-colors duration-200"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default FoodCard;
