# Vidly - Movie Rental Management System

A full-stack web application for managing movie rentals with user authentication, payment processing, membership tiers, and watchlist functionality.

## 🎬 Overview

Vidly is a full-stack movie rental management platform built with React,Node.js, Express, and MongoDB. It provides role-based authentication,
movie management, rental lifecycle management, Gold Membership, watchlists,payment simulation, and an admin analytics dashboard.

## ✨ Features

### User Features
- **Movie Browsing**: Browse and search through available movies with a stunning, high-contrast UI
- **Movie Rentals**: Rent movies with automatic stock management
- **Membership Tiers**: Upgrade to **Gold Membership** to increase active rental limits from 2 to 5 movies
- **Rental Management**: View active and returned rentals with payment history
- **Watchlist**: Save movies to a personal watchlist for later
- **User Profile**: Manage personal account information with a beautiful dashboard
- **Payment Simulation**: Rental fee calculation and simulated payment flow supporting UPI, Card, and Cash payment methods
- **Real-time Updates**: Watchlist count updates across browser tabs

### Admin Features
- **Admin Dashboard**: Comprehensive statistics including total revenue, active rentals, and top movies
- **Movie Management**: Create, update, and delete movies
- **Rental Overview**: View all rentals across the platform
- **Stock Management**: Automatic inventory tracking
- **User Management**: Access to user accounts and rental history

### Technical Features
- **Modern Styling**: Tailwind CSS implementation with glassmorphism, gradients, and micro-animations
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for users and admins
- **Server-Side Enforcement**: Strict backend validation of rental limits and payment processing
- **Payment Calculation**: Automatic fee calculation based on rental duration
- **Error Handling**: Comprehensive error boundaries, informative UI error states, and backend validation
- **Responsive Design**: Mobile-friendly layout

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** & **Bootstrap** - UI styling framework
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Joi Browser** - Form validation
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Joi** - Validation
- **Winston** - Logging
- **Helmet** - Security
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Vidly/
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Custom middleware (auth, error handling)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── startup/         # Application startup logic
│   ├── tests/           # Unit and integration tests
│   └── utils/           # Utility functions
│
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       │   ├── common/  # Reusable components
│       ├── services/    # API service layer
│       └── utils/       # Utility functions
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vidly
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost/vidly
   jwtPrivateKey=your-secret-key
   PORT=10000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure API URL**
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:10000/api
   ```

### Running the Application

1. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   node index.js
   ```
   Server runs on `http://localhost:10000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application opens at `http://localhost:3000`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

The application can be deployed to platforms like Render, Heroku, or Vercel. See `DEPLOYMENT.md` for detailed deployment instructions.

### Environment Variables for Production
- `NODE_ENV=production`
- `MONGODB_URI` - MongoDB Atlas connection string
- `jwtPrivateKey` - Secure JWT secret key
- `REACT_APP_API_URL` - Backend API URL

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid authentication
- Admin routes require admin privileges
- Tokens expire and require re-authentication

## 📊 API Endpoints

### Authentication & Users
- `POST /api/auth` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user profile
- `POST /api/users/me/upgrade` - Upgrade user to Gold Membership

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Rentals
- `GET /api/rentals` - Get all rentals (Admin)
- `GET /api/rentals/my` - Get user's rentals
- `POST /api/rentals` - Create rental
- `POST /api/rentals/:id/return` - Return rental with payment

### Watchlist
- `GET /api/watchlists` - Get user's watchlist
- `POST /api/watchlists` - Add to watchlist
- `DELETE /api/watchlists/:id` - Remove from watchlist

### Statistics (Admin)
- `GET /api/stats/dashboard` - Get comprehensive admin dashboard statistics

## 🎯 Key Features Implementation

### Membership Tiers
- **Regular Members**: Limited to 2 active rentals at a time
- **Gold Members**: Upgraded users who can rent up to 5 movies simultaneously
- Enforced seamlessly on both the frontend UI and backend API

### Payment System
- Calculates rental fees based on days rented
- Supports multiple payment methods (UPI, Card, Cash)
- Seamless Gold Membership checkout flow
- Stores payment history with timestamps
- Automatic stock restoration on return

### Rental Management
- Prevents double returns
- Tracks rental history
- Real-time stock updates

### Watchlist
- LocalStorage-based for instant access
- Syncs across browser tabs
- Badge count in navigation
- Server-side persistence option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Developed as a full-stack web application project demonstrating modern web development practices, focusing heavily on premium UI/UX design and robust API architecture.

## 🙏 Acknowledgments

- Built following Mosh Hamedani's Vidly course structure
- Significantly enhanced with additional features including payment processing, watchlist, Gold Memberships, admin dashboards, and modernized Tailwind CSS styling.

