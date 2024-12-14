const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new customer
exports.registerCustomer = async (req, res) => {
    try {
        const { password, ...otherDetails } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({ ...otherDetails, password: hashedPassword });
        await newCustomer.save();
        res.status(201).json({ customer: newCustomer, token });
    } catch (err) {
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
        const token = jwt.sign({ id: customer._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ customer, token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Get customer profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(customer);
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
