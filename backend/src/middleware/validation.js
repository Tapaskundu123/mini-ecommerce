const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ Validation Errors:', errors.array());
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

/**
 * Product validation rules
 */
const productValidation = {
    create: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Product name is required')
            .isLength({ max: 100 })
            .withMessage('Product name cannot exceed 100 characters'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Product description is required')
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
        body('price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('image')
            .trim()
            .notEmpty()
            .withMessage('Product image is required')
            .isURL()
            .withMessage('Image must be a valid URL'),
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Category is required')
            .isIn(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'])
            .withMessage('Invalid category'),
        body('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
    ],
};

/**
 * Cart validation rules
 */
const cartValidation = {
    addItem: [
        body('productId')
            .trim()
            .notEmpty()
            .withMessage('Product ID is required')
            .isMongoId()
            .withMessage('Invalid product ID'),
        body('quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be at least 1'),
        body('sessionId')
            .optional({ values: 'falsy' }),
    ],
    updateItem: [
        body('productId')
            .trim()
            .notEmpty()
            .withMessage('Product ID is required')
            .isMongoId()
            .withMessage('Invalid product ID'),
        body('quantity')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer'),
        body('sessionId')
            .trim()
            .notEmpty()
            .withMessage('Session ID is required'),
    ],
    removeItem: [
        body('productId')
            .trim()
            .notEmpty()
            .withMessage('Product ID is required')
            .isMongoId()
            .withMessage('Invalid product ID'),
        body('sessionId')
            .trim()
            .notEmpty()
            .withMessage('Session ID is required'),
    ],
    getCart: [
        param('sessionId')
            .trim()
            .notEmpty()
            .withMessage('Session ID is required'),
    ],
};

module.exports = {
    validate,
    productValidation,
    cartValidation,
};
