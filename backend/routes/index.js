const express = require('express');
const router = express.Router();

const foodRoutes = require('./foodRoutes');
const customerRoutes = require('./customerRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/foods', foodRoutes); // All food-related routes
router.use('/customers', customerRoutes); // All customer-related routes
router.use('/orders', orderRoutes); // All order-related routes
router.use('/admin', adminRoutes); // All admin-related routes

module.exports = router;
