import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<h1>Welcome to Restaurant Service</h1>} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
