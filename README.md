# Shri Ram Mandir - Temple Website

A full-stack MERN application for a modern, responsive Hindu temple website. It features a public-facing site for devotees and a secure JWT-authenticated Admin panel to manage dynamic content (Events, Gallery, Aarti Schedule, Donations).

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Router, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)
- **Media**: Multer & Cloudinary

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Node.js/Express application

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed or a MongoDB Atlas URI
- Cloudinary account credentials

### 1. Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your actual credentials (MongoDB URI, Cloudinary keys, JWT Secret).
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`. It connects to `http://localhost:5000/api` by default.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Initializing the Admin

To log into the admin panel for the first time:
1. Uncomment the `/setup` route in `server/routes/authRoutes.js` and call it via Postman `POST http://localhost:5000/api/auth/setup` to create the initial admin user.
2. The default credentials will be generated.
3. Access the admin dashboard at `http://localhost:3000/admin/login`.

## Design Themes
- Saffron (#FF6B00)
- Gold (#D4AF37)
- Cream (#FFF8E7)
- Maroon (#800020)
