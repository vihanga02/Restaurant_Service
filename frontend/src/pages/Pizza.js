import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactCard from '../components/FoodCard';
import bgImage from '../assets/background.jpg';

const Pizza = () => {
    const [pizzas, setPizzas] = useState({ seafood: [], vegetable: [], chicken: [], beef: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/foods');

                // Categorize pizzas
                const categorizedPizzas = { vegetable: [], chicken: [], beef: [], seafood: [] };
                response.data.forEach((pizza) => {
                    if (pizza.category2 === 'vegetable') {
                        categorizedPizzas.vegetable.push(pizza);
                    } else if (pizza.category2 === 'checken') {
                        categorizedPizzas.chicken.push(pizza);
                    } else if (pizza.category2 === 'beef') {
                        categorizedPizzas.beef.push(pizza);
                    } else if (pizza.category2 === 'seafood') {
                        categorizedPizzas.seafood.push(pizza);
                    }
                });

                setPizzas(categorizedPizzas);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pizza data:', err);
                setError('Failed to fetch pizza data.');
                setLoading(false);
            }
        };

        fetchPizzas();
    }, []);

    const handleAddToCart = (pizza) => {
        console.log(`Added to cart: ${pizza.name}`);
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading pizzas...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div 
            className="min-h-screen pt-16"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            <div className="min-h-screen bg-opacity-70 bg-yellow-50  pb-10">
                <h1 className="text-6xl font-black text-center text-yellow-600 mb-8 pt-5">Pizza Menu</h1>

                <div className="max-w-6xl mx-auto space-y-8">
                    {Object.keys(pizzas).map((category) => (
                        <div key={category} className="bg-white/30 border-b-2 border-white rounded-lg shadow-lg p-6">
                            <h2 className={`text-4xl font-semibold text-orange-600 mb-7`}>
                                {category.charAt(0).toUpperCase() + category.slice(1)} Pizzas
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {pizzas[category].map((pizza, index) => (
                                    <ContactCard key={index} item={pizza} onAddToCart={handleAddToCart} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pizza;
