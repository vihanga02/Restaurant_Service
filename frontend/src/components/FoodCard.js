import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodCard = ({ item, onAddToCart }) => {
    const navigate = useNavigate();

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

    return (
        <div
            className="bg-gray-50/20 rounded-lg shadow-xl p-4 text-center hover:shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={handleCardClick}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            
            <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-60 object-cover rounded"
            />
            <h3 className="text-xl font-bold mt-2">{capitalizeName(item.name)}</h3>
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
