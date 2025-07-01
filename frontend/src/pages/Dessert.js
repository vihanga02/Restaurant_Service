import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactCard from '../components/FoodCard';

const Desserts = () => {
    const [desserts, setDesserts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDesserts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/foods');
                const dessertsData = response.data.filter(food => food.category1 === 'dessert');
                setDesserts(dessertsData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dessert data:', err);
                setError('Failed to fetch dessert data.');
                setLoading(false);
            }
        };

        fetchDesserts();
    }, []);

    const handleAddToCart = (dessert) => {
        console.log(`Added to cart: ${dessert.name}`);
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading desserts...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen" style={{ backgroundImage: `url(${require('../assets/background.jpg')})` }}>
            <div className="min-h-screen bg-opacity-70 bg-yellow-50 pt-20 pb-10">
                <h1 className="text-6xl font-black text-center text-yellow-600 mb-8 pt-5">Desserts Menu</h1>
                <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 bg-white/30 border-b-10 border-white rounded-lg shadow-lg p-6">
                    {desserts.map((dessert, index) => (
                        <ContactCard key={index} item={dessert} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Desserts;
