import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodDetails = () => {
    const { id } = useParams(); // Get the food ID from the route params
    const navigate = useNavigate();
    const [food, setFood] = useState(null);
    const [quantity, setQuantity] = useState(1);

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

                <div className="p-6">
                    <h1 className="text-4xl font-bold text-yellow-600 mt-16">{toUpperCaseAll(food.name)}</h1>
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
