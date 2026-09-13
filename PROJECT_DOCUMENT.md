# Planters Agro Valley - Project Document

## 1. Project Overview
**Planters Agro Valley** is a comprehensive, full-stack e-commerce platform dedicated to selling plants, seeds, planters, fertilizers, and garden decor. It also offers specialized services like corporate gifting, plant rental, garden maintenance, vertical gardening, and balcony gardening.

The platform provides a user-friendly frontend for customers to browse products, read blogs, manage their cart/wishlist, and checkout. It also features a robust backend with a fully-fledged admin dashboard for managing users, products, categories, orders, coupons, shipping, and customer inquiries.

---

## 2. Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM
- **State Management:** Redux Toolkit, React Context API (CartProvider)
- **Styling & UI:** Tailwind CSS, Material UI (`@mui/material`), Emotion
- **Icons:** React Icons, Material Icons
- **Data Visualization:** Recharts
- **HTTP Client:** Axios
- **Notifications:** React Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **File Uploads & Storage:** Multer, Cloudinary
- **Emails:** Nodemailer
- **Payments Integration:** Razorpay
- **Security:** Helmet, CORS, Express Validator

---

## 3. Frontend Architecture

The frontend is structured in the `FRONTEND` directory and follows a modern React folder structure:

- `src/PAGES/`: Contains the main route views for both the customer-facing site and the admin dashboard.
  - **Customer Pages:** Home, Products (Plants, Seeds, Planters, etc.), Cart, Checkout, Profile, Wishlist, My Orders, Blog, FAQs.
  - **Admin Pages (`/dashboard`):** Dashboard Analytics, Product/Category Management, Order Management, User & Role Management, Settings, Shipping, Coupons, Audit Logs, and Recycle Bin.
- `src/COMPONENTS/`: Reusable UI components (Navbar, Footer, AuthModal, Checkout, ProtectedRoute).
- `src/context/`: Context API implementations (e.g., `CartContext`).
- `src/redux/`: Redux slices and store configuration.
- `src/layouts/`: Layout components (e.g., `AdminLayout`).

---

## 4. Backend Architecture

The backend is structured in the `SERVER` directory and follows an MVC (Model-View-Controller) pattern:

- **Routes (`/routes` & `/modules`)**: Defines API endpoints.
  - `authRoutes`: User registration, login, password reset.
  - `productRoutes`, `categoryRoutes`, `bannerRoutes`: Catalog management.
  - `cartRoutes`, `wishlistRoutes`, `orderRoutes`: E-commerce operations.
  - `paymentRoutes`: Razorpay integration for checkout.
  - `adminRoutes`, `adminDashboardRoutes`: Secure endpoints for admin management.
- **Controllers (`/controllers`)**: Contains the business logic for each route.
- **Models (`/models`)**: Mongoose schemas defining the MongoDB database structure.
- **Middleware (`/middleware`)**: Request interception (e.g., Auth verification, Admin role checks).
- **Services/Utils (`/services`, `/utils`)**: Helper functions, email sending logic (Nodemailer), file upload configs (Cloudinary).

---

## 5. Security & Features
- **Role-Based Access Control (RBAC):** Distinct access levels for Customers, Admins, Super Admins, and Shipping Managers.
- **Secure File Uploads:** Product and banner images are securely uploaded and served via Cloudinary.
- **Payment Processing:** Integrated Razorpay gateway for seamless and secure transactions.
- **Real-time Notifications:** Toast notifications on the frontend for user feedback.

---

## 6. Local Development Setup

### Prerequisites
- Node.js installed
- MongoDB instance (local or Atlas)
- Cloudinary Account (for image uploads)
- Razorpay Account (for payments)

### Running the Backend
1. Navigate to the server directory: `cd SERVER`
2. Install dependencies: `npm install`
3. Create a `.env` file with necessary variables (PORT, MONGO_URI, JWT_SECRET, CLOUDINARY credentials, RAZORPAY credentials, etc.).
4. Start the server: `npm run dev` (Runs on `nodemon`).

### Running the Frontend
1. Navigate to the frontend directory: `cd FRONTEND`
2. Install dependencies: `npm install`
3. Create a `.env` file with the Vite backend API URL (`VITE_API_BASE_URL`).
4. Start the development server: `npm run dev`
