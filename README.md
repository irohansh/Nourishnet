# NourishNet

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.13.0-red.svg)](https://mongoosejs.com/)

> A comprehensive food donation platform connecting distributors and collectors to minimize food waste and fight hunger in communities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Usage](#usage)

## Overview

NourishNet is a revolutionary web application designed to bridge the gap between surplus food sources and communities in need. Our platform enables food distributors to list excess food donations while allowing collectors to browse and request available donations, creating a sustainable food-sharing network that minimizes waste and maximizes community impact.

### Key Statistics

- **100+** Test donations processed with image uploads
- **Dual Role System** for distributors and collectors
- **Real-time** donation availability tracking
- **Comprehensive** feedback and rating system

## Features

### For Distributors
- **Dashboard Management**: Access dedicated distributor dashboard
- **Donation Logging**: Create detailed food donation listings with:
  - Food type and description
  - Allergy information
  - Quantity tracking (servings/items)
  - Pickup location and timing
  - Use-by date validation
  - High-quality image uploads
- **Active Donations**: View and manage current available donations
- **Order History**: Track fulfilled orders and delivery history
- **Feedback Review**: Monitor collector feedback and ratings

### For Collectors
- **Donation Browsing**: Explore available donations from all distributors
- **Request System**: Place orders for specific donations with quantity selection
- **Order Management**: Track order history and status
- **Feedback Submission**: Provide ratings and comments for completed orders
- **Regional Filtering**: Find donations in specific areas

### General Features
- **Role-based Authentication**: Secure user registration and login system
- **Image Management**: Multer-powered image upload and storage
- **Real-time Updates**: Dynamic donation availability tracking
- **Responsive Design**: Mobile-friendly interface
- **Data Validation**: Comprehensive input validation and error handling



### Development Tools
- **dotenv** - Environment variable management
- **Git** - Version control

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nourishnet.git
   cd nourishnet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nourishnet
   ```

4. **Database Setup**
   - Ensure MongoDB is running on your system
   - The application will automatically create the database and collections

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/changePassword - Change user password
POST /api/auth/forgotPassword - Password reset request
```

### Donation Endpoints
```
GET  /api/donations/active  - Get all active donations
GET  /api/donations/:id     - Get specific donation
POST /api/donations/add     - Create new donation
POST /api/donations/order   - Place donation order
PUT  /api/donations/:id     - Update donation
DELETE /api/donations/:id   - Delete donation
```

### User Management
```
GET /api/users/:id          - Get user by ID
PUT /api/users/:id          - Update user profile
GET /api/users              - Get all users
```

### Dashboard Endpoints
```
GET /api/dashboard/distributor/:id - Get distributor dashboard data
GET /api/dashboard/collector/:id   - Get collector dashboard data
```

### Feedback System
```
GET  /api/feedback/all           - Get all feedback
POST /api/feedback/submit        - Submit feedback
GET  /api/feedback/order/:orderId - Get feedback for specific order
```

## Project Structure

```
nourishnet/
├── backend/
│   ├── controllers/          # Request handling logic
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── donationController.js
│   │   ├── feedbackController.js
│   │   └── userController.js
│   ├── models/               # Database schemas
│   │   ├── Donation.js
│   │   ├── Feedback.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/               # API route definitions
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── donations.js
│   │   ├── feedback.js
│   │   └── user.js
│   └── server.js             # Main server file
├── css/                      # Stylesheets
├── js/                       # Frontend JavaScript
├── images/                   # Static images
├── uploads/                  # User uploaded files
├── *.html                    # Frontend pages
├── package.json
└── README.md
```

## Usage

### Getting Started

1. **Registration**: Create an account as either a distributor or collector
2. **Login**: Access your role-specific dashboard
3. **Distributors**: Start by adding your first food donation
4. **Collectors**: Browse available donations and place requests
5. **Feedback**: Rate and review completed orders

