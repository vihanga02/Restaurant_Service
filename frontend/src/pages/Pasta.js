import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactCard from '../components/FoodCard';
import { useSearchParams } from 'react-router-dom';

const Pasta = () => {
    const [pastas, setPastas] = useState([]);
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

    const filteredPastas = pastas.filter(pasta => {
        const matchesSearch = pasta.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pasta.description && pasta.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFavorite = !showFavoritesOnly || favoriteIds.includes(pasta._id);
        const matchesRating = (pasta.starRating || 0) >= minRating;
        return matchesSearch && matchesFavorite && matchesRating;
    });

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
        <div className="min-h-screen pt-16" style={{ backgroundImage: `url(${require('../assets/background.jpg')})` }}>
            <div className="min-h-screen bg-opacity-70 bg-yellow-50 pb-10">
                <h1 className="text-6xl font-black text-center text-yellow-600 mb-8 pt-5">Pasta Menu</h1>
                {/* Glassy Search Bar and Favorites Toggle */}
                <div className="max-w-3xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center ">
                  <div className="flex-1 flex items-center glassy-bar px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30">
                    <input
                      type="text"
                      placeholder="Search pastas..."
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
                  <label className="flex items-center gap-2 text-yellow-700 font-semibold cursor-pointer select-none glassy-bar px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30">
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
                <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 bg-white/30 border-b-10 border-white rounded-lg shadow-lg p-6">
                    {filteredPastas.map((pasta, index) => (
                        <ContactCard key={index} item={pasta} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pasta;
