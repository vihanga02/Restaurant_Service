import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import Pizza from "./pages/Pizza";
import Pasta from "./pages/Pasta";
import Soup from "./pages/Soup";
import Drinks from "./pages/Drink";
import Desserts from "./pages/Dessert";
import CustomerOrders from "./pages/Userpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FoodDetails from "./pages/FoodDetail";
import UserPage from "./pages/Userpage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminFoods from "./pages/AdminFoods";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Categories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pizza" element={<Pizza />} />
            <Route path="/pasta" element={<Pasta />} />
            <Route path="/soup" element={<Soup />} />
            <Route path="/drinks" element={<Drinks />} />
            <Route path="/desserts" element={<Desserts />} />
            <Route path="/orders" element={<CustomerOrders />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/food-details/:id" element={<FoodDetails />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/foods" element={<AdminFoods />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
