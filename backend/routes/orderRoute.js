const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const authenticateToken = require('../middleware/authentication');


router.post('/', authenticateToken("Customer"), orderController.addToCart);

router.get('/customer',authenticateToken("Customer"), orderController.getCustomerOrders);

router.delete('/cancel/:id',authenticateToken("Customer"), orderController.cancelOrder);

router.post('/paid/:id',authenticateToken("Customer"), orderController.markOrderAsPaid);

router.put('/:id/delivered', orderController.markOrderAsDelivered);

// Route to get pending order count for the logged-in customer
router.get('/pending/count', authenticateToken("Customer"), orderController.getPendingOrderCount);

router.get('/customer/last3',authenticateToken("Customer"), orderController.getLastThreeOrders);

router.get('/customer/paginated',authenticateToken("Customer"), orderController.getCustomerOrdersPaginated);

router.get('/:id', authenticateToken("Customer"), orderController.getOrderById);

module.exports = router;
