# TOMATO - Food Ordering Website

**TOMATO is a comprehensive, full-stack food delivery platform that seamlessly connects hungry customers with restaurant menus using a modern React frontend and a robust Express/PostgreSQL backend.**
It also features an integrated Admin portal for menu and order management, robust JWT authentication, and secure Stripe payment processing.
## Demo

- User Panel: [https://food-delivery-frontend-s2l9.onrender.com/](https://food-delivery-frontend-s2l9.onrender.com/)
- Admin Panel: [https://food-delivery-admin-wrme.onrender.com/](https://food-delivery-admin-wrme.onrender.com/)

## Features

- User Panel
- Admin Panel
- JWT Authentication
- Auth endpoints under `/api/auth`
- Password Hashing with Bcrypt
- Stripe Payment Integration
- Payments endpoint under `/api/payments`
- Login/Signup
- Logout
- Add to Cart
- Place Order
- Order Management
- Products Management
- Restaurant and menu APIs
- Filter Food Products
- Login/Signup
- Authenticated APIs
- REST APIs
- Role-Based Identification
- Basic rate limiting
- Beautiful Alerts

## API Surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/restaurants`
- `GET /api/restaurants/:id/menu`
- `POST /api/payments`
- `POST /api/payments/verify`
- `POST /api/food/add`
- `GET /api/food/list`

## Screenshots

![Hero](https://i.ibb.co/59cwY75/food-hero.png)
- Hero Section

![Products](https://i.ibb.co/JnNQPyQ/food-products.png)
- Products Section

![Cart](https://i.ibb.co/t2LrQ8p/food-cart.png)
- Cart Page

![Login](https://i.ibb.co/s6PgwkZ/food-login.png)
- Login Popup

## Run Locally

Clone the project

```bash
    git clone https://github.com/Mshandev/Food-Delivery
```
Go to the project directory

```bash
    cd Food-Delivery
```
Install dependencies (frontend)

```bash
    cd frontend
    npm install
```
Install dependencies (backend)

```bash
    cd backend
    npm install
```

```bash
    cd backend
    npm run server
```

Start the Frontend server (Includes Admin panel at /admin)

```bash
    cd frontend
    npm run dev
```


## Deployment

The application is deployed on Render.
