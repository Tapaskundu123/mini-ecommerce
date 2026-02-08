const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        image: {
            type: String,
            required: [true, 'Product image is required'],
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock quantity is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual property to check if product is available
productSchema.virtual('available').get(function () {
    return this.stock > 0 && this.inStock;
});

// Update inStock based on stock quantity
productSchema.pre('save', function (next) {
    this.inStock = this.stock > 0;
    next();
});

// Instance method to decrease stock
productSchema.methods.decreaseStock = async function (quantity) {
    if (this.stock < quantity) {
        throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
    this.inStock = this.stock > 0;
    return this.save();
};

// Instance method to increase stock
productSchema.methods.increaseStock = async function (quantity) {
    this.stock += quantity;
    this.inStock = true;
    return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
