ZipDrinks 🍹

A full-stack eCommerce web application for ordering soft drinks, energy drinks, and beverages online.
Built with a modern MERN-style architecture using React + Vite, Node.js + Express, and MongoDB.

The project includes:

🛍️ User shopping experience
❤️ Wishlist & Cart system
💳 Razorpay payment integration
🔐 JWT Authentication + Google OAuth
🎟️ Coupons & Offers
📦 Order & Return Management
👨‍💼 Admin Dashboard
📊 Sales Reports (PDF & Excel)
💰 Wallet & Referral System
🚀 Live Demo
Frontend: Add your deployed frontend URL
Backend API: Add your backend API URL
📸 Features
👤 User Features
User Signup & Login
Email OTP Verification
Google Authentication
JWT Authentication
Product Browsing & Filtering
Product Variants & Offers
Cart Management
Wishlist Management
Address Management
Razorpay Payment Gateway
Wallet Payment
Coupon Application
Order Placement
Order Cancellation & Returns
Invoice Download
Referral System
User Wallet & Transactions
🛠️ Admin Features
Admin Authentication
Dashboard Analytics
Product Management
Category Management
Banner Management
Coupon Management
Customer Management
Order Management
Sales Report Generation
Export Sales Reports to:
PDF
Excel
🧰 Tech Stack
Frontend
React.js
Vite
Redux Toolkit
React Router
Axios
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Passport Google OAuth
Nodemailer
Razorpay
PDFKit
ExcelJS
📁 Project Structure
ZipDrinks/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── Services/
│   └── utils/
│
├── frontent/
│   ├── src/
│   │   ├── Components/
│   │   ├── pages/
│   │   ├── Store/
│   │   └── Helper/
│
└── README.md
⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/zipdrinks.git
cd zipdrinks
2️⃣ Backend Setup
cd backend
npm install
Create .env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
FRONTEND_URL_MAIN=http://localhost:5173

SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

RAZOR_PAY_API_KEY=your_razorpay_key
RAZOR_PAY_API_SECRET=your_razorpay_secret
Run Backend
npm run server
3️⃣ Frontend Setup
cd frontent
npm install
Run Frontend
npm run dev
🔑 Important API Routes
User Routes
Method	Endpoint	Description
POST	/api/auth/register	Register User
POST	/api/auth/login	Login User
GET	/api/products	Get Products
POST	/api/cart	Add to Cart
POST	/api/order/place-order	Place Order
Admin Routes
Method	Endpoint	Description
POST	/api/admin/auth/login	Admin Login
GET	/api/admin/products	Get Products
POST	/api/admin/products/add-product	Add Product
GET	/api/admin/orders	Get Orders
🔒 Authentication

This project uses:

JWT Access Tokens
Protected Routes
Admin Middleware
Google OAuth Authentication
📊 Sales Reports

Admins can generate:

📄 PDF Sales Reports
📑 Excel Sales Reports

Implemented using:

PDFKit
ExcelJS
💳 Payment Integration

Integrated with:

Razorpay Payment Gateway
Wallet Payments
Cash on Delivery (COD)
📦 Core Modules
Authentication
Products
Categories
Cart
Wishlist
Orders
Coupons
Wallet
Referral System
Admin Dashboard
Sales Analytics
🧪 Future Improvements
Product Reviews & Ratings
Real-time Notifications
Inventory Tracking
Multi-vendor Support
Docker Deployment
CI/CD Pipeline
Unit & Integration Testing
🤝 Contributing

Contributions are welcome!

Fork the repository
Create your feature branch
Commit your changes
Push to the branch
Create a Pull Request
📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Developed by Alameen

If you like this project, give it a ⭐ on GitHub!
