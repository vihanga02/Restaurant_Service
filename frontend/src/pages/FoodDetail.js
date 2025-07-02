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
    const [reviewStars, setReviewStars] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [showAllReviews, setShowAllReviews] = useState(false);

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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError("");
        if (reviewStars < 0 || reviewStars > 5) {
            setReviewError("Please select a star rating between 0 and 5.");
            return;
        }
        setReviewLoading(true);
        try {
            await axios.post(`http://localhost:8000/api/foods/${id}/review`, {
                stars: reviewStars,
                comment: reviewComment
            }, { withCredentials: true });
            setReviewStars(0);
            setReviewComment("");
            setReviewLoading(false);
            toast.success("Review submitted!");
            // Refresh food details
            const response = await axios.get(`http://localhost:8000/api/foods/${id}`);
            setFood(response.data);
        } catch (err) {
            setReviewLoading(false);
            setReviewError(err.response?.data?.error || "Failed to submit review.");
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
                    {/* Star Rating Display */}
                    <div className="flex items-center gap-2 mt-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < Math.round(food.starRating) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                        ))}
                        <span className="ml-2 text-lg text-gray-700">{food.starRating ? food.starRating.toFixed(1) : '0.0'} / 5</span>
                        <span className="ml-2 text-sm text-gray-600">({food.numReviews || 0} reviews)</span>
                    </div>
                </div>
            </div>
            {/* Reviews Section */}
            <div className="max-w-3xl mx-auto mt-12 bg-white/60 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-orange-700 mb-4">Reviews</h2>
                {food.reviews && food.reviews.length > 0 ? (
                    (() => {
                        // Sort reviews by stars (desc), then by date (desc)
                        const sortedReviews = [...food.reviews].sort((a, b) => {
                            if (b.stars !== a.stars) return b.stars - a.stars;
                            // If stars are equal, sort by date (newest first)
                            return new Date(b.date || 0) - new Date(a.date || 0);
                        });
                        const reviewsToShow = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);
                        return (
                            <>
                                <ul className="space-y-4">
                                    {reviewsToShow.map((review, idx) => (
                                        <li key={idx} className="border-b border-gray-200 pb-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={i < review.stars ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                                                ))}
                                                <span className="ml-2 text-sm text-gray-700">{review.stars} / 5</span>
                                                <span className="ml-4 text-xs text-gray-500">{review.date ? new Date(review.date).toLocaleDateString() : ''}</span>
                                            </div>
                                            <div className="text-gray-800 text-base">{review.comment || <span className="italic text-gray-400">No comment</span>}</div>
                                        </li>
                                    ))}
                                </ul>
                                {sortedReviews.length > 3 && !showAllReviews && (
                                    <button
                                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        onClick={() => setShowAllReviews(true)}
                                    >
                                        View More Reviews
                                    </button>
                                )}
                                {sortedReviews.length > 3 && showAllReviews && (
                                    <button
                                        className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        onClick={() => setShowAllReviews(false)}
                                    >
                                        Show Less
                                    </button>
                                )}
                            </>
                        );
                    })()
                ) : (
                    <div className="text-gray-500 italic">No reviews yet.</div>
                )}
                {/* Review Form for logged-in users */}
                {isLoggedIn && (
                    <form onSubmit={handleReviewSubmit} className="mt-8 p-4 bg-white/80 rounded shadow space-y-4">
                        <h3 className="text-lg font-bold text-orange-700 mb-2">Add Your Review</h3>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">Your Rating:</label>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    className={i < reviewStars ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}
                                    onClick={() => setReviewStars(i + 1)}
                                    aria-label={`Rate ${i + 1} stars`}
                                >★</button>
                            ))}
                            <span className="ml-2 text-sm">{reviewStars} / 5</span>
                        </div>
                        <textarea
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Write your comment (optional)"
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            rows={3}
                        />
                        {reviewError && <div className="text-red-600 text-sm">{reviewError}</div>}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-yellow-600 text-white font-bold rounded hover:bg-yellow-700"
                            disabled={reviewLoading}
                        >
                            {reviewLoading ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FoodDetails;
