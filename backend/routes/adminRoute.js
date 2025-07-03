const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const authenticateToken = require('../middleware/authentication');


router.post('/login', adminController.adminLogin);

router.post('/register', adminController.adminRegister);

// Protect all routes below with Admin authentication
router.get('/orders', authenticateToken('Admin'), adminController.getAllOrders);
router.put('/orders/:id/status', authenticateToken('Admin'), adminController.updateOrderStatus);
router.get('/customers', authenticateToken('Admin'), adminController.getAllCustomers);

// Admin check login status
router.get('/check-login', authenticateToken('Admin'), adminController.checkLogin);

module.exports = router;
