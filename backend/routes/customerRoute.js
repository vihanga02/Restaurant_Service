const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');
const authenticateToken = require('../middleware/authentication')


router.post('/register', customerController.registerCustomer);

router.post('/login', customerController.loginCustomer);

router.get('/', customerController.getCustomers);

router.get('/navbar', authenticateToken('Customer'), customerController.checkLogin);

router.get('/profile', authenticateToken('Customer'), customerController.getCustomerProfile);

router.put('/:id', customerController.updateCustomer);

router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
