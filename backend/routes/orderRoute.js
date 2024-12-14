const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/', orderController.placeOrder);

router.get('/customer/:customerId', orderController.getCustomerOrders);

router.put('/:id/cancel', orderController.cancelOrder);

router.put('/:id/paid', orderController.markOrderAsPaid);

router.put('/:id/delivered', orderController.markOrderAsDelivered);

module.exports = router;
