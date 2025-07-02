const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');


router.post('/login', adminController.adminLogin);

router.get('/orders', adminController.getAllOrders);

router.put('/orders/:id/status', adminController.updateOrderStatus);

router.get('/customers', adminController.getAllCustomers);

router.post('/register', adminController.adminRegister);

module.exports = router;
