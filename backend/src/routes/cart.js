const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require('../controllers/cartController');
const { cartValidation, validate } = require('../middleware/validation');

// Cart routes
router.get('/:sessionId', cartValidation.getCart, validate, getCart);
router.post('/', cartValidation.addItem, validate, addToCart);
router.put('/', cartValidation.updateItem, validate, updateCartItem);
router.delete('/', cartValidation.removeItem, validate, removeFromCart);
router.delete('/:sessionId/clear', cartValidation.getCart, validate, clearCart);

module.exports = router;
