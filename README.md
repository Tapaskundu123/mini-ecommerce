# E-Commerce Mini Application

A full-stack e-commerce application built with **Next.js** (frontend) and **Node.js/Express** (backend), containerized with **Docker**.

## 🚀 Features

### Frontend (Next.js + TypeScript)
- ✅ Product listing page with modern glassmorphism design
- ✅ Product cards with images, name, price, and "Add to Cart" button
- ✅ Shopping cart page with quantity update and remove item functionality
- ✅ State management using **Redux Toolkit**
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Premium UI with animations and micro-interactions
- ✅ Functional components only
- ✅ No UI libraries (custom CSS)

### Backend (Node.js + Express + MongoDB)
- ✅ `GET /api/products` - Fetch all products with filtering and pagination
- ✅ `POST /api/cart` - Add items to cart
- ✅ `PUT /api/cart` - Update cart item quantity
- ✅ `DELETE /api/cart` - Remove items from cart
- ✅ Validation middleware using `express-validator`
- ✅ Comprehensive error handling
- ✅ MongoDB database integration
- ✅ Environment variables using `.env`
- ✅ Clean code architecture with controllers, models, and services

### Docker
- ✅ Dockerfile for frontend (multi-stage build)
- ✅ Dockerfile for backend (multi-stage build)
- ✅ `docker-compose.yml` for complete application orchestration
- ✅ MongoDB service included
- ✅ Health checks and proper networking

## 📁 Project Structure

```
naksh_jewels/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & database configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Validation & error handling
│   │   ├── models/          # MongoDB models (Product, Cart)
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── app.js           # Express app configuration
│   ├── server.js            # Server entry point
│   ├── seed.js              # Database seeding script
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js App Router
│   │   ├── cart/            # Cart page
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Header/
│   │   ├── ProductCard/
│   │   └── CartItem/
│   ├── store/               # Redux store
│   │   └── slices/          # Redux slices
│   ├── services/            # API client
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml       # Docker orchestration
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **CSS Modules** - Scoped styling
- **Custom Design System** - Glassmorphism, gradients, animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Express Validator** - Request validation
- **Helmet** - Security middleware
- **Morgan** - Logging
- **CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Naksh_jewels
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)
   - MongoDB: `mongodb://localhost:27017`

4. **Stop the application**
   ```bash
   docker-compose down
   ```

### Running Locally (Development)

#### Backend
```bash
cd backend
npm install
npm run seed    # Seed database with sample products
npm run dev     # Start development server
```

#### Frontend
```bash
cd frontend
npm install
npm run dev     # Start development server
```

Make sure MongoDB is running locally or update the `MONGODB_URI` in `backend/.env`.

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
  - Query params: `category`, `search`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart/:sessionId` - Get cart by session ID
- `POST /api/cart` - Add item to cart
  ```json
  {
    "productId": "string",
    "quantity": number,
    "sessionId": "string" (optional)
  }
  ```
- `PUT /api/cart` - Update cart item quantity
  ```json
  {
    "productId": "string",
    "quantity": number,
    "sessionId": "string"
  }
  ```
- `DELETE /api/cart` - Remove item from cart
  ```json
  {
    "productId": "string",
    "sessionId": "string"
  }
  ```
- `DELETE /api/cart/:sessionId/clear` - Clear entire cart

## 🎨 Design Features

- **Modern Glassmorphism UI** - Frosted glass effect cards with backdrop blur
- **Vibrant Color Palette** - Purple/blue gradient scheme with HSL colors
- **Smooth Animations** - Hover effects, transitions, loading states
- **Responsive Design** - Mobile-first approach with breakpoints
- **Accessibility** - Keyboard navigation, focus states, ARIA labels
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - User-friendly error messages

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongodb:27017/ecommerce
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Test Backend API
```bash
# Get all products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":"<product-id>","quantity":1}'
```

## 📝 Code Quality

- ✅ Clean code architecture with separation of concerns
- ✅ TypeScript for type safety (frontend)
- ✅ Input validation and sanitization
- ✅ Error handling middleware
- ✅ Security best practices (Helmet, CORS)
- ✅ Functional components only (React)
- ✅ Custom hooks for reusability
- ✅ Modular CSS with CSS Modules

## 🎯 Key Highlights

1. **Advanced Architecture** - Clean separation between controllers, services, and models
2. **Robust Validation** - Comprehensive input validation using express-validator
3. **State Persistence** - Cart data persisted in MongoDB with session management
4. **Production Ready** - Multi-stage Docker builds for optimized images
5. **Premium UI/UX** - Modern design with glassmorphism and smooth animations
6. **Type Safety** - Full TypeScript implementation in frontend
7. **Responsive** - Works seamlessly on all device sizes

## 📄 License

This project is for demonstration purposes.

## 👨‍💻 Author

Built with ❤️ as a demonstration of clean code and modern web development practices.
