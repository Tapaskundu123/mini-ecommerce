const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { v4: uuidv4 } = require('uuid');

/**
 * @desc    Get cart by session ID
 * @route   GET /api/cart/:sessionId
 * @access  Public
 */
const getCart = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    let cart = await Cart.findOne({ sessionId }).populate('items.product', '-__v');

    if (!cart) {
        // Create new cart if doesn't exist
        cart = await Cart.create({ sessionId, items: [] });
    }

    res.status(200).json({
        success: true,
        data: cart,
    });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Public
 */
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, sessionId: providedSessionId } = req.body;

    // Generate session ID if not provided
    const sessionId = providedSessionId || uuidv4();

    // Validate product exists and has sufficient stock
    const product = await Product.findById(productId);

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    if (!product.available) {
        throw new ValidationError('Product is out of stock');
    }

    if (product.stock < quantity) {
        throw new ValidationError(
            `Insufficient stock. Only ${product.stock} items available`
        );
    }

    // Find or create cart
    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
        cart = new Cart({ sessionId, items: [] });
    }

    // Check if total quantity (existing + new) exceeds stock
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (totalQuantity > product.stock) {
        throw new ValidationError(
            `Cannot add ${quantity} items. Only ${product.stock - (existingItem ? existingItem.quantity : 0)
            } more available`
        );
    }

    // Add item to cart
    await cart.addItem(product, quantity);

    // Populate product details
    await cart.populate('items.product', '-__v');

    res.status(200).json({
        success: true,
        data: cart,
        sessionId,
    });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart
 * @access  Public
 */
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity, sessionId } = req.body;

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
        throw new NotFoundError('Cart not found');
    }

    // If quantity > 0, validate stock
    if (quantity > 0) {
        const product = await Product.findById(productId);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        if (quantity > product.stock) {
            throw new ValidationError(
                `Insufficient stock. Only ${product.stock} items available`
            );
        }
    }

    // Update item quantity (removes if quantity is 0)
    await cart.updateItemQuantity(productId, quantity);

    // Populate product details
    await cart.populate('items.product', '-__v');

    res.status(200).json({
        success: true,
        data: cart,
    });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart
 * @access  Public
 */
const removeFromCart = asyncHandler(async (req, res) => {
    const { productId, sessionId } = req.body;

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
        throw new NotFoundError('Cart not found');
    }

    await cart.removeItem(productId);

    // Populate product details
    await cart.populate('items.product', '-__v');

    res.status(200).json({
        success: true,
        data: cart,
    });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart/:sessionId
 * @access  Public
 */
const clearCart = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
        throw new NotFoundError('Cart not found');
    }

    await cart.clearCart();

    res.status(200).json({
        success: true,
        data: cart,
    });
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
