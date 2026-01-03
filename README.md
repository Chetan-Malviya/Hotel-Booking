# 🏨 QuickStay – Full Stack Hotel Booking Platform (MERN)

QuickStay is a fully functional **Hotel Booking Web Application** built using the **MERN Stack**.  
The platform allows users to browse hotels, book rooms, make secure online payments, and receive booking confirmations via email.  
An **Admin Dashboard** is included for managing hotels and bookings.

🔗 **Live Demo:** https://quickstay-bychetan.vercel.app/  

---

## 📌 Project Overview

QuickStay is designed to demonstrate real-world **full stack development** practices using modern tools and services.  
The project includes authentication, role-based access, REST APIs, payment gateway integration, and production deployment.

This project was built as a **full stack project** with industry-level architecture.

---

## ✨ Features

### 👤 User Features
- User authentication (Sign In / Sign Up / Profile) using **Clerk**
- Browse and search available hotels
- View detailed hotel information
- Book hotel rooms
- View booking history
- Secure online payments using **Stripe**
- Instant booking confirmation via **Email**

### 🛠️ Admin Dashboard
- Add and manage hotels
- View and manage all bookings
- Admin-only protected routes

---

## 🧱 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Clerk Authentication
- Stripe Checkout

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Clerk Backend Authentication
- Nodemailer (Email service)

### Deployment
- Vercel (Frontend & Backend)
- MongoDB Atlas

---

## 🗂️ Project Structure

├── client/ # React frontend

│ ├── src/

│ ├── public/

│ └── package.json

│

├── server/ # Node.js + Express backend

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ └── utils/

│

├── .env

├── package.json

└── README.md


---

## 🔐 Authentication

Authentication is handled using **Clerk**, providing:
- Secure JWT-based authentication
- Ready-to-use UI components
- Backend token verification
- Role-based access for admin routes

---

## 💳 Payment Gateway

- Integrated **Stripe Payment Gateway**
- Secure checkout flow for hotel bookings
- Payment confirmation after successful booking

---

## 📧 Email Notifications

- Automatic booking confirmation emails
- Implemented using **Nodemailer**
- Emails sent immediately after booking success

---

## 🚀 Deployment

- Frontend and backend deployed on **Vercel**
- Environment variables securely managed
- Production-ready build configuration

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Chetan-Malviya/Hotel-Booking.git
cd Hotel-Booking
```

### 2️⃣ Install Dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3️⃣ Environment Variables
Create .env files for frontend and backend and configure:
```bash
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4️⃣ Run the Project Locally
``` bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
```

## 👨‍💻 Author

**Chetan Malviya**  
Full Stack Developer (MERN)
