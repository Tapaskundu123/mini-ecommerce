const app = require('./src/app');
const connectDB = require('./src/config/database');
const config = require('./src/config/env');

// Connect to MongoDB
connectDB();

// ✅ Use Render / cloud assigned port first
const PORT = process.env.PORT || config.port || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
