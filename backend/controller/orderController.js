const Order = require('../models/order');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: 'Failed to place order' });
  }
};

// Add new food items to the current order
exports.addFoodItemsToOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const newFoodItems = req.body.foodItems;
    order.foodItems.push(...newFoodItems);
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add food items to order' });
  }
};

// Get all orders for a customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).populate('foodItems.item');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = 'Cancelled';
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

// Mark an order as paid
exports.markOrderAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = 'Paid';
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark order as paid' });
    }
};

// Mark an order as delivered
exports.markOrderAsDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = 'Delivered';
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark order as delivered' });
    }
};