import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactCard from '../components/FoodCard';
import bgImage from '../assets/background.jpg';
import { useSearchParams } from 'react-router-dom';

const Pizza = () => {
    const [pizzas, setPizzas] = useState({ seafood: [], vegetable: [], chicken: [], beef: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showFavMsg, setShowFavMsg] = useState("");
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        const urlSearch = searchParams.get('search') || "";
        setSearchTerm(urlSearch);
    }, [searchParams]);

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

    // Check login and fetch favorites if needed
    useEffect(() => {
        const checkLoginAndFetchFavorites = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/customers/navbar', { withCredentials: true });
                if (response.data && response.data.success === true) {
                    setIsLoggedIn(true);
                    if (showFavoritesOnly) {
                        const favRes = await axios.get('http://localhost:8000/api/customers/favorites', { withCredentials: true });
                        setFavoriteIds(favRes.data.favorites.map(fav => fav._id));
                        setShowFavMsg("");
                    }
                } else {
                    setIsLoggedIn(false);
                    setFavoriteIds([]);
                    if (showFavoritesOnly) setShowFavMsg("Please log in to use favorites filter.");
                }
            } catch (err) {
                setIsLoggedIn(false);
                setFavoriteIds([]);
                if (showFavoritesOnly) setShowFavMsg("Please log in to use favorites filter.");
            }
        };
        if (showFavoritesOnly) {
            checkLoginAndFetchFavorites();
        } else {
            setFavoriteIds([]);
            setShowFavMsg("");
        }
    }, [showFavoritesOnly]);

    // Filter pizzas by search term, favorites, and minRating
    const filteredPizzas = {};
    Object.keys(pizzas).forEach(category => {
        filteredPizzas[category] = pizzas[category].filter(pizza => {
            const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pizza.description && pizza.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesFavorite = !showFavoritesOnly || favoriteIds.includes(pizza._id);
            const matchesRating = (pizza.starRating || 0) >= minRating;
            return matchesSearch && matchesFavorite && matchesRating;
        });
    });

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
                {/* Glassy Search Bar and Favorites Toggle */}
                <div className="max-w-3xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center ">
                  <div className="flex-1 flex items-center min-w-0 glassy-bar px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30">
                    <input
                      type="text"
                      placeholder="Search pizzas..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="px-2 py-0 border-none outline-none bg-transparent text-gray-700 w-full placeholder-gray-400 text-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-2 glassy-bar px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30">
                    <label className="text-yellow-700 font-semibold">Min Rating:</label>
                    <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="px-2 py-1 rounded border bg-transparent">
                      {[0,1,2,3,4,5].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-yellow-700 font-semibold cursor-pointer select-none glassy-bar px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={e => setShowFavoritesOnly(e.target.checked)}
                      className="accent-yellow-500 bg-transparent"
                    />
                    Show Favorites Only
                  </label>
                </div>
                {showFavMsg && <div className="text-center text-red-500 mb-4">{showFavMsg}</div>}
                <div className="max-w-6xl mx-auto space-y-8">
                    {Object.keys(filteredPizzas).map((category) => (
                        <div key={category} className="bg-white/30 border-b-2 border-white rounded-lg shadow-lg p-6">
                            <h2 className={`text-4xl font-semibold text-orange-600 mb-7`}>
                                {category.charAt(0).toUpperCase() + category.slice(1)} Pizzas
                            </h2>
                            <div className="grid grid-cols-4 gap-4">
                                {filteredPizzas[category].map((pizza, index) => (
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
