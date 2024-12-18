import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import pizzaImage from "../assets/navbar-pizza.jpg";

library.add(fab, fas);

const Footer = () => {
    return (
        <footer className="bg-orange-50 text-orange-950">
            <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:justify-between gap-14">
                {/* About Section */}
                <div>
                    <div className='flex items-center mb-8'>
                        <h2 className='text-orange-600 font-black text-xl'>La Pizzeria</h2>
                        <img src={pizzaImage} alt="pizza" className="w-10 h-10 " />
                    </div>
                    <p><FontAwesomeIcon icon={['fas', 'phone']} /> &nbsp; +123 456 789</p>
                    <p><FontAwesomeIcon icon={['fas', 'envelope']} /> &nbsp; info@pizzacompany.com</p>
                    <p className="mt-4 text-gray-400">
                        We serve the best pizza in town with fresh ingredients and a lot of love.
                    </p>
                </div>

                {/* Quick Links and Follow Us */}
                <div className="mb-8 md:mb-0 md:w-1/3 flex flex-col space-y-8">
                    {/* Quick Links */}
                    <div>
                        <h2 className="text-xl font-semibold text-yellow-500">Quick Links</h2>
                        <ul className="mt-2 text-gray-400 space-y-2 flex flex-row gap-3">
                            <li className='m-2'><a href="/" className="hover:text-orange-300">Home</a></li>
                            <li className='m-1'><a href="/menu" className="hover:text-orange-300">Menu</a></li>
                            <li className='m-1'><a href="/about" className="hover:text-orange-300">About Us</a></li>
                            <li className='m-1'><a href="/contact" className="hover:text-orange-300">Contact</a></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h2 className="text-xl font-semibold text-yellow-500">Follow Us</h2>
                        <div className="mt-4 flex space-x-4 text-gray-400">
                            <a href="#" className="hover:text-white"><FontAwesomeIcon icon={['fab', 'facebook']} /></a>
                            <a href="#" className="hover:text-white"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
                            <a href="#" className="hover:text-white"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
                            <a href="#" className="hover:text-white"><FontAwesomeIcon icon={['fab', 'youtube']} /></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-orange-100 text-center py-4 mt-8">
                &copy; LaPizzeria.com | Designed by vihanga02
            </div>
        </footer>
    );
}

export default Footer;
