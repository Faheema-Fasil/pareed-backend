# Pareed Backend API (Node.js + Express + MongoDB Atlas)

A complete RESTful API server engineered for **Pareed Fish Trading L.L.C** built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** using the **Model-View-Controller (MVC)** architectural pattern.

---

## 📁 Architecture

```text
pareed-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & DNS resolution config
│   ├── controllers/              # Business logic & request processing
│   │   ├── auth.controller.js    # Login, Register, Profile, Forgot/Reset password
│   │   ├── product.controller.js # Products catalog CRUD & bulk save
│   │   ├── service.controller.js # Services CRUD & bulk save
│   │   ├── team.controller.js    # Leadership & team members CRUD & bulk save
│   │   ├── whyChooseUs.controller.js # Why choose us items & bulk save
│   │   ├── inquiry.controller.js # Contact form leads & inquiry management
│   │   ├── setting.controller.js # General, Hero, & About CMS settings
│   │   ├── dashboard.controller.js # Real-time dashboard overview metrics
│   │   └── upload.controller.js  # File & image upload handler
│   ├── models/                   # Mongoose schemas & data models
│   │   ├── user.model.js         # User model with bcrypt encryption
│   │   ├── product.model.js      # Product schema
│   │   ├── service.model.js      # Service schema
│   │   ├── team.model.js         # Team member schema
│   │   ├── whyChooseUs.model.js  # Why choose us schema
│   │   ├── inquiry.model.js      # Customer contact inquiry schema
│   │   └── setting.model.js      # Dynamic CMS settings schema
│   ├── routes/                   # Modular Express routes
│   │   ├── auth.routes.js        # /api/auth
│   │   ├── product.routes.js     # /api/products
│   │   ├── service.routes.js     # /api/services
│   │   ├── team.routes.js        # /api/team
│   │   ├── whyChooseUs.routes.js # /api/why-choose-us
│   │   ├── inquiry.routes.js     # /api/inquiries
│   │   ├── setting.routes.js     # /api/settings
│   │   ├── dashboard.routes.js   # /api/dashboard
│   │   ├── upload.routes.js      # /api/upload
│   │   └── index.js              # Central /api router
│   ├── middlewares/              # Express middlewares
│   │   ├── auth.middleware.js    # JWT Bearer token protection & Admin check
│   │   ├── error.middleware.js   # Centralized error handler & 404 handler
│   │   └── upload.middleware.js  # Multer disk storage image upload
│   └── utils/                    # Helper scripts
│       ├── generateToken.js      # JWT token signer
│       └── seeder.js             # Initial database seeder
├── uploads/                      # Uploaded images directory
├── .env                          # Environment variables
├── .env.example                  # Template environment variables
├── .gitignore
├── package.json
└── server.js                     # Server entry point
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database (Optional)
Populate your database with default products, services, team members, settings, and an admin user (`admin@pareed.com` / `adminpassword123`):
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new account | Public |
| `POST` | `/api/auth/login` | Sign in & retrieve JWT | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user details | Private |
| `POST` | `/api/auth/forgot-password` | Request password reset | Public |
| `POST` | `/api/auth/reset-password` | Reset password | Public |

### 🐟 Products Catalog (`/api/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Get all active products for slider | Public |
| `GET` | `/api/products/:id` | Get single product details | Public |
| `POST` | `/api/products` | Create a new product | Private / Admin |
| `PUT` | `/api/products/:id` | Update product by ID | Private / Admin |
| `PUT` | `/api/products/bulk` | Bulk save entire products catalog | Private / Admin |
| `DELETE` | `/api/products/:id` | Delete product | Private / Admin |

### 🚢 Services (`/api/services`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/services` | Get all services | Public |
| `POST` | `/api/services` | Create new service | Private / Admin |
| `PUT` | `/api/services/bulk` | Bulk save services | Private / Admin |
| `PUT` | `/api/services/:id` | Update service by ID | Private / Admin |
| `DELETE` | `/api/services/:id` | Delete service | Private / Admin |

### 👥 Team Members (`/api/team`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/team` | Get team members | Public |
| `POST` | `/api/team` | Create team member | Private / Admin |
| `PUT` | `/api/team/bulk` | Bulk save team | Private / Admin |
| `PUT` | `/api/team/:id` | Update team member | Private / Admin |
| `DELETE` | `/api/team/:id` | Delete team member | Private / Admin |

### 🌟 Why Choose Us (`/api/why-choose-us`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/why-choose-us` | Get 5 why choose us items | Public |
| `PUT` | `/api/why-choose-us/bulk` | Bulk save items | Private / Admin |

### 📩 Inquiries & Leads (`/api/inquiries`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/inquiries` | Submit inquiry from Contact Form | Public |
| `GET` | `/api/inquiries` | Get all inquiries | Private / Admin |
| `GET` | `/api/inquiries/:id` | Get single inquiry details | Private / Admin |
| `PUT` | `/api/inquiries/:id` | Update lead status/notes | Private / Admin |
| `DELETE` | `/api/inquiries/:id` | Delete lead | Private / Admin |

### ⚙️ CMS Settings (`/api/settings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/settings` | Get all settings (General, Hero, About) | Public |
| `GET` | `/api/settings/:section` | Get section setting (`hero`, `about`, `general`) | Public |
| `PUT` | `/api/settings/:section` | Update section setting | Private / Admin |

### 📊 Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Get overview stats and recent leads | Private / Admin |

### 🖼️ File Upload (`/api/upload`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/upload` | Upload image file (multipart/form-data) | Public / Admin |
