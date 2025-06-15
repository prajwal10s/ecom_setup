import express from "express";
import * as dotenv from "dotenv";
import ProductService from "./services/productService.js";
import store from "./inMemoryStore.js";
import clientRoutes from "./routes/clientRoutes.js";
import CartService from "./services/cartService.js";
import CouponService from "./services/couponService.js";
import OrderService from "./services/OrderService.js";
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

// Instantiate service based on the shared store
const productService = new ProductService(store);
const cartService = new CartService(store, productService);
const couponService = new CouponService(store);
const orderService = new OrderService(store, productService, couponService);

app.use(express.json()); // Middleware used for parsing JSON request bodies

app.use("/api", clientRoutes(productService, cartService));

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API!");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
