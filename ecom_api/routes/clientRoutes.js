import express from "express";
import { v4 } from "uuid";
const clientRoutes = (ProductService) => {
  const router = express.Router();

  router.get("/products", (req, res) => {
    const products = ProductService.getAllProducts();
    res.json(products);
  });

  return router;
};
export default clientRoutes;
