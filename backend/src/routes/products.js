const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { productValidation, validate } = require('../middleware/validation');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes (for demo, not implementing auth)
router.post('/', productValidation.create, validate, createProduct);
router.put('/:id', productValidation.create, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
