require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const config = require('./src/config/env');

const products = [
    {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling headphones with 30-hour battery life and superior sound quality.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electronics',
        stock: 45,
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, and customizable watch faces.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: 'Electronics',
        stock: 30,
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable, eco-friendly t-shirt made from 100% organic cotton. Available in multiple colors.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        category: 'Clothing',
        stock: 120,
    },
    {
        name: 'Classic Denim Jeans',
        description: 'Stylish slim-fit jeans with premium denim fabric and modern cut.',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        category: 'Clothing',
        stock: 85,
    },
    {
        name: 'Bestselling Mystery Novel',
        description: 'Gripping thriller that will keep you on the edge of your seat. A must-read for mystery lovers.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        category: 'Books',
        stock: 200,
    },
    {
        name: 'Self-Help Success Guide',
        description: 'Transform your life with proven strategies from leading success coaches.',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        category: 'Books',
        stock: 150,
    },
    {
        name: 'Indoor Plant Collection',
        description: 'Set of 3 beautiful air-purifying indoor plants perfect for home or office.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
        category: 'Home & Garden',
        stock: 60,
    },
    {
        name: 'Ergonomic Office Chair',
        description: 'Adjustable lumbar support chair designed for all-day comfort and productivity.',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500',
        category: 'Home & Garden',
        stock: 25,
    },
    {
        name: 'Yoga Mat Premium',
        description: 'Non-slip, eco-friendly yoga mat with extra cushioning for maximum comfort.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        category: 'Sports',
        stock: 95,
    },
    {
        name: 'Tennis Racket Professional',
        description: 'Lightweight carbon fiber racket designed for advanced players.',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1617083278620-e5f2e194e940?w=500',
        category: 'Sports',
        stock: 40,
    },
    {
        name: 'Educational Building Blocks',
        description: 'Creative STEM toy set with 500+ pieces for endless building possibilities.',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
        category: 'Toys',
        stock: 75,
    },
    {
        name: 'Remote Control Drone',
        description: 'HD camera drone with GPS, obstacle avoidance, and 25-minute flight time.',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500',
        category: 'Toys',
        stock: 20,
    },
    {
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof speaker with 360° sound, 12-hour battery, and bass boost.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        category: 'Electronics',
        stock: 110,
    },
    {
        name: 'Leather Laptop Bag',
        description: 'Professional genuine leather bag with padded laptop compartment and multiple pockets.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
        category: 'Clothing',
        stock: 55,
    },
    {
        name: 'Cookbook Collection: World Cuisine',
        description: 'Explore global flavors with 200+ authentic recipes from around the world.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500',
        category: 'Books',
        stock: 80,
    },
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongodbUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert seed data
        await Product.insertMany(products);
        console.log(`✨ Inserted ${products.length} products`);

        console.log('✅ Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
