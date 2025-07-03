const Order = require('../models/order');
const Customer = require('../models/customer');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password' });
            
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin._id, role: "Admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to login' });

    }
};

// View all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('foodItems.item');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
};

// View all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Admin register
exports.adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ admin: newAdmin });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Failed to register admin' });
    }
};

// Check admin login status
exports.checkLogin = async (req, res) => {
  try {
    if (req.user && req.user.role === 'Admin') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to check login status' });
  }
};
