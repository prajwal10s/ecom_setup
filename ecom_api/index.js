import express from "express";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware used for parsing JSON request bodies

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API!");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
