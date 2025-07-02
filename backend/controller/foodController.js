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

// Add a review to a food item
exports.addReview = async (req, res) => {
  try {
    const { stars, comment, user } = req.body;
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    if (typeof stars !== 'number' || stars < 0 || stars > 5) {
      return res.status(400).json({ error: 'Stars must be a number between 0 and 5' });
    }
    // Optionally, check if user already reviewed (if user is required)
    food.reviews.push({ user, stars, comment });
    food.numReviews = food.reviews.length;
    food.starRating = food.reviews.reduce((acc, r) => acc + r.stars, 0) / food.numReviews;
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add review' });
  }
};
