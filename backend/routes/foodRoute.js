const express = require('express');
const router = express.Router();
const foodController = require('../controller/foodController');

router.get('/', foodController.getAllFoods);

router.get('/:id', foodController.getFoodById);

router.post('/', foodController.addFood);

router.put('/:id', foodController.updateFood);

router.delete('/:id', foodController.deleteFood);

router.post('/:id/review', foodController.addReview);

module.exports = router;
