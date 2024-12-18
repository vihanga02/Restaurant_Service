const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');


router.post('/register', customerController.registerCustomer);

router.post('/login', customerController.loginCustomer);

router.get('/:id', customerController.getCustomerProfile);

router.put('/:id', customerController.updateCustomer);

router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
