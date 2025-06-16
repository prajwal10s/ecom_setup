🚀 E-commerce API & UI Project

This repository showcases a simple e-commerce system, featuring a backend API built with Node.js and Express, and a basic frontend UI powered by React.
📦 E-commerce API (Backend)

The ecommerce-api directory contains the core backend logic for the store.
Features

    Product Catalog: Fetches and lists available products.

    Shopping Cart: Manages client-specific shopping carts, allowing item additions.

    Checkout Process: Handles order placement, including discount validation and application.

    Dynamic Discounts: Implements a rule where every Nth order triggers the generation of a new, single-use, 10% discount code applicable to the entire order.

    Admin Metrics: Provides endpoints to monitor key store performance indicators like total items purchased, total sales amount, and discount code history.

    In-memory Store: All data (products, carts, orders, metrics, coupon state) is stored in memory, making setup straightforward without a database. Please note: Data will reset upon server restart.

Technologies

    Node.js & Express: For building the RESTful API.

    JSDoc: Used for API documentation within the code.(Very useful)

    Jest: For unit testing core services.

Setup & Run

    Navigate to the ecommerce-api directory in your terminal:

    cd ecom_api

    Install the necessary Node.js packages:

    npm install

    Start the API server:

    npm start
    # For development with automatic restarts:
    # npm run dev

    The API will be accessible at http://localhost:3000.

    You can test out the endpoints using postman or run testcases which have been defined by running npm test

Key API Endpoints

    GET /api/products: Retrieve all available products.

    GET /api/cart?cartId=<ID>: Get an existing cart or create a new one. (Accepts cartId query param).

    POST /api/cart/add: Add an item to a specified cart.

        Body: {"cartId": "string", "productId": "string", "quantity": number}

    POST /api/checkout: Finalize a cart into an order.

        Body: {"cartId": "string", "couponCode": "string (optional)"}

    GET /api/admin/metrics: View aggregate store data (sales, orders, discounts).

    POST /api/admin/generate-discount-code: Manually trigger coupon generation (will only succeed if the Nth order condition is met and no active coupon is available, as per business rules).

🖥️ E-commerce UI (Frontend)

The ecommerce-ui directory contains a minimal React application to interact with the backend API.
Overview

This simple web interface allows you to:

    Browse products.

    Add items to your cart.

    Perform a checkout, applying an active discount code if available.

    Monitor real-time admin metrics.

    Manually test the admin coupon generation.

Technologies

    React: For building the interactive UI.

    JSX: Standard syntax for React components.

    Tailwind CSS: For rapid and responsive styling.

    Babel Standalone: Used for in-browser JSX compilation (suitable for this simple demo, not for production).

Setup & Run

    Ensure the Backend API is running first (refer to the ecommerce-api section above).

    Navigate to the ecommerce-ui directory:

    cd ecom_ui/ecom_ui

    Serve the UI files using any local web server (e.g., http-server):

    npx http-server .
    # Or using Python's simple server: python -m http.server

    Open your web browser and go to the address provided by the server (e.g., http://localhost:5173).
