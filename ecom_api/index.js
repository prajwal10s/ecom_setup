import express from "express";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
