import React, { useState } from "react";
import garfield from "../assets/home.jpg";
import home1 from "../assets/home1.jpg";
import home2 from "../assets/home2.jpg";
import home3 from "../assets/home3.jpg";

const Home = () => {
    return (
        <div className="bg-gray-50 mb-10 container mx-auto p-4 mt-16 flex flex-col justify-between w-screen">
            <div className="w-full flex justify-between">
                <div className="w-1/2 p-10 md:pt-28 flex flex-col justify-center">
                    <h1 className="text-5xl font-black mb-1 font-serif text-orange-800 bg-orange-200 p-5 text-center lg:text-6xl">Less Waiting.</h1>
                    <h1 className="text-5xl font-black font-serif text-orange-900 bg-orange-100 p-5 text-center lg:text-6xl">More EATING.</h1>
                </div>
                
                <div className="w-1/2 relative top-11">
                    <img src={garfield} alt="pizza" className="relative w-full h-auto"/>
                </div>
            </div>

            <div className="w-full mt-16 flex flex-col items-center">
                <h2 className="text-4xl font-bold mt-4 mb-4">About Our Company</h2>
                <div className="w-3/4 flex flex-col md:flex-row items-center">
                    <img src={home1} alt="company" className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4 h-auto"/>
                    <p className="text-lg leading-relaxed">
                        We are a leading restaurant service provider with a passion for delivering delicious food and exceptional service. Our mission is to make dining out a delightful experience for our customers. Join us and enjoy the best meals with less waiting and more eating!
                    </p>
                </div>
            </div>
            <div className="w-full mt-10 flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
                <div className="w-3/4 flex flex-col md:flex-row items-center">
                    <p className="text-lg leading-relaxed">
                        Our vision is to revolutionize the dining experience by integrating technology and innovation. We aim to provide a seamless and enjoyable dining experience for our customers, making every meal memorable.
                    </p>
                    <img src={home2} alt="vision" className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4 h-auto"/>
                </div>
            </div>

            <div className="w-full mt-10 flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
                <div className="w-3/4 flex flex-col md:flex-row items-center">
                    <img src={home3} alt="contact" className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4 h-auto"/>
                    <p className="text-lg leading-relaxed">
                        Have any questions or feedback? Feel free to reach out to us at contact@restaurantservice.com or call us at (123) 456-7890. We are always here to assist you and ensure you have the best dining experience.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;