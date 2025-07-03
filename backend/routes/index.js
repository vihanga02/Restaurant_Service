const express = require('express');
const router = express.Router();

const foodRoutes = require('./foodRoute');
const customerRoutes = require('./customerRoute');
const orderRoutes = require('./orderRoute');
const adminRoutes = require('./adminRoute');
const chatRoute = require('./chatRoute');

router.use('/foods', foodRoutes); // All food-related routes
router.use('/customers', customerRoutes); // All customer-related routes
router.use('/orders', orderRoutes); // All order-related routes
router.use('/admin', adminRoutes); // All admin-related routes
router.use('/chat', chatRoute); // All chat-related routes

module.exports = router;
