const Order = require('../models/order');
const Food = require('../models/food');
const Customer = require('../models/customer');

exports.addToCart = async (req, res) => {
  try {
      const { foodId, quantity } = req.body;
      const customerId = req.user.id; 

      let customer = await Customer.findById(customerId);
      let order = await Order.findOne({ customerId, status: "Pending" });

      if (!order) {
          order = new Order({
              customerId: customer._id,
              customerName: customer.name,
              email: customer.email,
              deliveryAddress: customer.address,
              phone: customer.phone,
              foodItems: [],
              totalPrice: 0,
              status: "Pending",
          });
      }

      const existingItem = order.foodItems.find(item => item.item.toString() === foodId);

      if (existingItem) {
          existingItem.quantity += quantity;
      } else {
          order.foodItems.push({ item: foodId, quantity });
      }

      const foodItem = await Food.findById(foodId);
      if (!foodItem) {
          return res.status(404).json({ error: "Food item not found" });
      }
      order.totalPrice += foodItem.price * quantity;

      await order.save();

      res.status(200).json({ message: "Item added to cart", order });
  } catch (err) {
      console.error("Error adding to cart:", err);
      res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Get all orders for a customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).populate('foodItems.item');
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

// Get count of pending orders for a customer
exports.getPendingOrderCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ customerId: req.user.id, status: "Pending" });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending order count' });
  }
};

// Get last 3 orders for a customer
exports.getLastThreeOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .sort({ orderedAt: -1 })
      .limit(3)
      .populate('foodItems.item');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch last 3 orders' });
  }
};