import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import menu from '../assets/menu.jpg';

// Updated SVGs for each category
const categoryIcons = {
    Pizza: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-24 h-24 text-orange-500 mb-4"
        >
            <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm5.29 7.71-7 7a1 1 0 0 1-1.41-1.42l7-7a1 1 0 0 1 1.41 1.42ZM12 4a8 8 0 1 1-8 8 8.009 8.009 0 0 1 8-8Z" />
        </svg>
    ),
    Pasta: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-24 h-24 text-orange-500 mb-4"
        >
            <path d="M12 2C9.22 2 6.79 3.76 6.2 6.4L4 7v1h1v9.35a6 6 0 1 0 14 0V8h1V7l-2.2-.6C17.21 3.76 14.78 2 12 2ZM6.5 8h11v8h-1a6.005 6.005 0 0 0-9 0h-1ZM6.5 9.69l-.62-.2-.3 1.13.62.2.3-1.13Zm11.12-.2-.62.2.3 1.13.62-.2-.3-1.13ZM5 8.5v7.35a4.011 4.011 0 0 1 .38-.36L5 8.5Zm13 7.35V8.5l-.38.36A4.011 4.011 0 0 1 18 15.85Z" />
        </svg>
    ),
    Soup: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-24 h-24 text-orange-500 mb-4"
        >
            <path d="M12 2a5 5 0 0 0-5 5v1h10V7a5 5 0 0 0-5-5ZM7 8H5v8a7 7 0 0 0 7 7 7 7 0 0 0 7-7V8H17Zm-1 9a5 5 0 0 1 10 0H6ZM11 10a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1Z" />
        </svg>
    ),
    Drinks: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-24 h-24 text-orange-500 mb-4"
        >
            <path d="M17 2H7a2 2 0 0 0-2 2v5.59A2.41 2.41 0 0 0 7 12h10a2.41 2.41 0 0 0 2-2.41V4a2 2 0 0 0-2-2ZM8 14a4 4 0 0 0 0 8h8a4 4 0 0 0 0-8H8Zm-1 4a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z" />
        </svg>
    ),
    Desserts: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-24 h-24 text-orange-500 mb-4"
        >
            <path d="M12 3a7 7 0 0 0-7 7 7.19 7.19 0 0 0 1 3.34A7.48 7.48 0 0 0 12 18a7.48 7.48 0 0 0 6-4.66A7.19 7.19 0 0 0 19 10a7 7 0 0 0-7-7Zm0 2a5 5 0 0 1 5 5 5.32 5.32 0 0 1-.68 2.37 5.48 5.48 0 0 1-8.64 0A5.32 5.32 0 0 1 7 10a5 5 0 0 1 5-5Z" />
        </svg>
    ),
};

const Categories = () => {
    const categories = [
        { name: 'Pizza', link: '/pizza' },
        { name: 'Pasta', link: '/pasta' },
        { name: 'Soup', link: '/soup' },
        { name: 'Drinks', link: '/drinks' },
        { name: 'Desserts', link: '/desserts' },
    ];

    return (
        <div className="">
            <img src={menu} alt="menu" className="w-full h-auto opacity-70" />
            <h1 className="text-6xl w-fit font-black relative -top-52 left-96 ml-80 font-serif text-orange-800">
                CATEGORIES
            </h1>
            <div className="mx-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category, index) => (
                    <Link
                        to={category.link}
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg"
                    >
                        {/* Render the SVG icon */}
                        {categoryIcons[category.name]}
                        <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
