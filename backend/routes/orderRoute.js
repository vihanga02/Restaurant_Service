const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const authenticateToken = require('../middleware/authentication');


router.post('/', authenticateToken("Customer"), orderController.addToCart);

router.get('/customer',authenticateToken("Customer"), orderController.getCustomerOrders);

router.delete('/cancel/:id',authenticateToken("Customer"), orderController.cancelOrder);

router.post('/paid/:id',authenticateToken("Customer"), orderController.markOrderAsPaid);

router.put('/:id/delivered', orderController.markOrderAsDelivered);

module.exports = router;
