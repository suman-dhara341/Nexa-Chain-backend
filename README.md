# Nexa Chain - Backend API

This repository contains the **Node.js** and **Express.js** backend implementation for the **Nexa Chain** investment and referral-based platform.

The backend serves as the core engine responsible for:

* JWT Authentication & Authorization
* User Management
* Investment Processing
* Multi-Level Referral Tracking
* Daily ROI Distribution
* Wallet Management
* Dashboard Analytics
* Automated Cron Jobs

---

# 🚀 Features

## Authentication

* User Registration
* User Login
* JWT-Based Authentication
* Password Encryption using bcrypt

## Investment Management

* Create Investment Plans
* Track Active Investments
* Investment History
* ROI Calculation

## Referral System

* Multi-Level Referral Tracking
* Referral Tree Structure
* Automated Referral Commission Distribution
* Level Income Tracking

## Dashboard Analytics

* Total Investments
* Total ROI Earned
* Wallet Balance
* Referral Income Summary

## Automation

* Automated Daily ROI Distribution
* Scheduled Cron Jobs
* Idempotent Processing Logic

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* node-cron
* CORS
* dotenv

---

# 📦 Project Setup

## Prerequisites

Before running the application, ensure you have:

* Node.js (v16 or higher)
* MongoDB (Local or MongoDB Atlas)
* npm

---

## Clone Repository

```bash
git clone <your-backend-repository-link>
cd Nexa-Chain-backend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nexachain?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here

# Optional: Render Keep Alive URL
RENDER_EXTERNAL_URL=https://your-live-backend-url.onrender.com
```

---

## Run Development Server

### Using npm

```bash
npm start
```

### Using Node

```bash
node server.js
```

Server will be available at:

```text
http://localhost:5000
```

---

# 📁 Project Structure

```text
Nexa-Chain-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── investmentController.js
│   ├── referralController.js
│   └── userController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Investment.js
│   ├── ReferralIncome.js
│   └── RoiHistory.js
│
├── routes/
│   ├── authRoutes.js
│   ├── investmentRoutes.js
│   ├── referralRoutes.js
│   └── userRoutes.js
│
├── services/
│   ├── cronJob.js
│   └── referralService.js
│
├── utils/
│
├── .env
├── package.json
├── server.js
└── README.md
```

> Update this structure if your actual backend folder structure differs.

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RENDER_EXTERNAL_URL=https://your-live-backend-url.onrender.com
```

---

# 📚 API Documentation

All protected routes require a valid JWT token in the request header.

Example:

```http
Authorization: Bearer <jwt-token>
```

---

## Authentication Routes

Base URL:

```http
/api/auth
```

### Register User

```http
POST /api/auth/register
```

Registers a new user and handles referral code linking.

### Login User

```http
POST /api/auth/login
```

Authenticates user credentials and returns a JWT token.

---

## Investment Routes

Base URL:

```http
/api/investments
```

### Create Investment

```http
POST /api/investments
```

Creates a new investment plan and activates the investment node.

### Get Investment History

```http
GET /api/investments
```

Returns active and completed investments for the authenticated user.

### Dashboard Metrics

```http
GET /api/investments/dashboard
```

Returns:

* Wallet Balance
* Total Investments
* Total ROI Earned
* Recent Investment Activity

---

## User & Referral Routes

### User Details

```http
GET /api/user/details
```

Returns:

* User Information
* ROI History
* Referral Tree
* Level Income Records

### Referral Information

```http
GET /api/referrals
```

Returns referral-related statistics and network details.

---

# 🔑 Authentication Flow

1. User registers or logs in.
2. Backend validates credentials.
3. JWT token is generated.
4. Token is returned to the client.
5. Protected routes verify the token using middleware.

Example:

```http
Authorization: Bearer <jwt-token>
```

---

# ⚙️ Automated ROI Distribution

The application uses **node-cron** to process daily ROI distributions.

### Cron Schedule

* Runs every day at **12:00 AM**
* Credits eligible users automatically
* Updates ROI history records
* Updates wallet balances

---

# 🎯 Business Logic

## Referral Commission Distribution

The platform supports multi-level referral rewards:

| Level   | Commission |
| ------- | ---------- |
| Level 1 | 5%         |
| Level 2 | 3%         |
| Level 3 | 2%         |

Referral commissions are automatically distributed when investment activation conditions are satisfied.

---

# 📌 Assumptions

## Idempotent Scheduler

The cron job is designed to prevent duplicate ROI credits even if the server restarts or jobs execute multiple times.

## Referral Distribution

Referral commissions are automatically calculated and distributed during investment activation.

## Mongoose Relationships

MongoDB collections use Mongoose ObjectId references to maintain data integrity.

## Server Keep-Alive

A keep-alive mechanism may be used on platforms like Render to prevent cron interruptions caused by server sleep.

## CORS Security

API access is restricted to authorized frontend domains only.

---

# 🚀 Deployment

Build and deploy the backend on:

* Render
* Railway
* AWS EC2
* DigitalOcean
* Heroku
* VPS Servers

Production Environment Variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
```

---

# 🤝 Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

