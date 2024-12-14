const Food = require('../models/food');

// Get all food items
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch food items' });
  }
};

// Get a specific food item by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.status(200).json(food);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the food item' });
  }
};

// Add a new food item
exports.addFood = async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add food item' });
  }
};

// Update a food item
exports.updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.status(200).json(updatedFood);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update food item' });
  }
};

// Delete a food item
exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete food item' });
  }
};
