const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Food = require('../models/food');

// Register a new customer
exports.registerCustomer = async (req, res) => {
    try {
        const { password, ...otherDetails } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({ ...otherDetails, password: hashedPassword });
        await newCustomer.save();
        res.status(201).json({ customer: newCustomer });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Failed to register customer' });
    }
};

// Login a customer (with token generation)
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: customer._id, role: "Customer" },  process.env.SECRET_KEY || "your_secret_key", { expiresIn: '1h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  }
  catch (err) {
    res.status(500).json({ error: 'Failed to check login status' });
  }
}

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.status(200).json({ customer: customer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
};

// Update customer profile
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update customer profile' });
  }
};

// Delete customer account
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer account' });
  }
};

// Get all favorites for the logged-in customer
exports.getFavorites = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate('favourites');
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ favorites: customer.favourites });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// Add a food to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { foodId } = req.body;
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    if (!customer.favourites.includes(foodId)) {
      customer.favourites.push(foodId);
      await customer.save();
    }
    res.status(200).json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
};

// Remove a food from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const foodId = req.params.foodId;
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    customer.favourites = customer.favourites.filter(fav => fav.toString() !== foodId);
    await customer.save();
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
};
