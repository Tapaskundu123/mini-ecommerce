const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        items: [cartItemSchema],
        totalItems: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate totals before saving
cartSchema.pre('save', function (next) {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = async function (product, quantity) {
    const existingItemIndex = this.items.findIndex(
        (item) => item.product.toString() === product._id.toString()
    );

    if (existingItemIndex > -1) {
        // Update existing item quantity
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({
            product: product._id,
            quantity,
            price: product.price,
        });
    }

    return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
    const itemIndex = this.items.findIndex(
        (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
        throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        this.items.splice(itemIndex, 1);
    } else {
        this.items[itemIndex].quantity = quantity;
    }

    return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
    this.items = this.items.filter(
        (item) => item.product.toString() !== productId.toString()
    );
    return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = async function () {
    this.items = [];
    return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
