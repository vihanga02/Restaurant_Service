import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/foods";

const initialFood = {
  name: "",
  price: "",
  description: "",
  category1: "",
  category2: "",
  imageUrl: ""
  // Removed starRating
};

// Predefined categories
const CATEGORY1_OPTIONS = ["pizza", "pasta", "soup", "drink", "dessert"];
const CATEGORY2_OPTIONS = ["beef", "chicken", "seafood", "vegetable"]; // Note: fixed "checken" to "chicken"

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [foodForm, setFoodForm] = useState(initialFood);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setFoods(response.data);
    } catch (err) {
      setError("Failed to fetch foods");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodForm({ 
      ...foodForm, 
      [name]: value,
      // Reset category2 if category1 is not pizza
      ...(name === 'category1' && value !== 'pizza' ? { category2: '' } : {})
    });
  };

  // Handle image upload - Upload to imgbb and get URL
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create preview URL immediately using original file
        const loadingUrl = URL.createObjectURL(file);
        setFoodForm((prev) => ({
          ...prev,
          imageUrl: loadingUrl
        }));

        // Create FormData for imgbb upload using original file
        const formDataImage = new FormData();
        formDataImage.append("image", file);

        // Upload to imgbb
        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=4e08e03047ee0d48610586ad270e2b39",
          {
            method: "POST",
            body: formDataImage,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }

        const data = await response.json();
        const uploadedUrl = data.data.url;

        // Replace preview with actual uploaded URL
        setFoodForm((prev) => ({
          ...prev,
          imageUrl: uploadedUrl
        }));

        console.log("Image uploaded successfully:", uploadedUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload image. Please try again.");
        setFoodForm((prev) => ({
          ...prev,
          imageUrl: prev.imageUrl || ""
        }));
      }
    }
  };

  // Open modal for add/edit
  const openModal = (food = initialFood, id = null) => {
    setFoodForm({ ...food });
    setEditMode(!!id);
    setEditId(id);
    setModalOpen(true);
    setError("");
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setFoodForm(initialFood);
    setEditMode(false);
    setEditId(null);
    setError("");
  };

  // Remove food item
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this food item?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchFoods(); // Refresh the list
    } catch (err) {
      console.error("Error removing food:", err);
      setError("Failed to remove food item: " + (err.response?.data?.message || err.message));
    }
  };

  // Add or edit food
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("foodForm data:", foodForm);
      
      // Create JSON object
      const foodData = {
        name: foodForm.name,
        price: foodForm.price,
        description: foodForm.description,
        category1: foodForm.category1,
        category2: foodForm.category2,
        imageUrl: foodForm.imageUrl
        // Removed starRating
      };

      console.log("Sending data:", foodData);

      if (editMode) {
        const response = await axios.put(`${API_URL}/${editId}`, foodData, {
          headers: { "Content-Type": "application/json" }
        });
        console.log("Update response:", response.data);
      } else {
        const response = await axios.post(`${API_URL}`, foodData, {
          headers: { "Content-Type": "application/json" }
        });
        console.log("Create response:", response.data);
      }
      
      closeModal();
      fetchFoods();
    } catch (err) {
      console.error("Error saving food:", err);
      console.error("Error response:", err.response?.data);
      setError("Failed to save food: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-10 w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-orange-700 mb-8">Food Management</h2>
        <button
          className="mb-6 px-6 py-2 bg-yellow-500/80 text-white font-bold rounded-lg shadow hover:bg-yellow-600 transition"
          onClick={() => openModal()}
        >
          Add New Food
        </button>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Category 1</th>
                <th className="px-4 py-2">Category 2</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id} className="border-b border-white/40">
                  <td className="px-4 py-2">{food.name}</td>
                  <td className="px-4 py-2">LKR {food.price}</td>
                  <td className="px-4 py-2">{food.category1}</td>
                  <td className="px-4 py-2">{food.category2 || "-"}</td>
                  <td className="px-4 py-2">
                    {food.imageUrl && <img src={food.imageUrl} alt={food.name} className="w-12 h-12 object-cover rounded" />}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="mr-2 px-3 py-1 bg-yellow-500/80 text-white rounded hover:bg-yellow-600"
                      onClick={() => openModal(food, food._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      onClick={() => handleRemove(food._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={closeModal}>&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-orange-700">{editMode ? "Edit Food" : "Add Food"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name" 
                value={foodForm.name} 
                onChange={handleChange} 
                placeholder="Food Name" 
                className="w-full px-4 py-2 border rounded" 
                required 
              />
              <input 
                type="number" 
                name="price" 
                value={foodForm.price} 
                onChange={handleChange} 
                placeholder="Price" 
                className="w-full px-4 py-2 border rounded" 
                required 
              />
              
              {/* Category 1 Dropdown */}
              <select 
                name="category1" 
                value={foodForm.category1} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border rounded" 
                required
              >
                <option value="">Select Category</option>
                {CATEGORY1_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Category 2 Dropdown - Only show if category1 is pizza */}
              {foodForm.category1 === 'pizza' && (
                <select 
                  name="category2" 
                  value={foodForm.category2} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select Pizza Type</option>
                  {CATEGORY2_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              )}
              
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="w-full px-4 py-2 border rounded" 
              />
              {foodForm.imageUrl && (
                <div className="flex justify-center">
                  <img src={foodForm.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded" />
                </div>
              )}
              <textarea 
                name="description" 
                value={foodForm.description} 
                onChange={handleChange} 
                placeholder="Description" 
                className="w-full px-4 py-2 border rounded" 
                rows="3"
              />
              <button 
                type="submit" 
                className="w-full py-2 bg-yellow-500/80 text-white font-bold rounded hover:bg-yellow-600"
              >
                {editMode ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;