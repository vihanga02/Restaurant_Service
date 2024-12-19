import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactCard from '../components/FoodCard';

const Pasta = () => {
    const [pastas, setPastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPastas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/foods');
                const pastaData = response.data.filter(item => item.category1 === 'pasta');
                setPastas(pastaData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pasta data:', err);
                setError('Failed to fetch pasta data.');
                setLoading(false);
            }
        };

        fetchPastas();
    }, []);

    const handleAddToCart = (pasta) => {
        console.log(`Added to cart: ${pasta.name}`);
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading pastas...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen mt-20 mb-10">
            <h1 className="text-6xl font-black text-center text-yellow-600 mb-8 pt-5">Pasta Menu</h1>
            <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4">
                {pastas.map((pasta, index) => (
                    <ContactCard key={index} item={pasta} onAddToCart={handleAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default Pasta;
