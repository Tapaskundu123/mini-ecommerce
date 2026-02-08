const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');
const { NotFoundError } = require('../utils/errors');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};

    if (category) {
        query.category = category;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Build sort
    let sortOption = {};
    if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach((field) => {
            if (field.startsWith('-')) {
                sortOption[field.substring(1)] = -1;
            } else {
                sortOption[field] = 1;
            }
        });
    } else {
        sortOption = { createdAt: -1 }; // Default sort by newest
    }

    // Execute query with pagination
    const products = await Product.find(query)
        .sort(sortOption)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const count = await Product.countDocuments(query);

    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit),
        },
    });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).select('-__v');

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    res.status(200).json({
        success: true,
        data: product,
    });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Admin only - for demo purposes, not implementing auth)
 */
const createProduct = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product,
    });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: product,
    });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new NotFoundError('Product not found');
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
