import mongoose from "mongoose";
import express from "express";
import userRoute from "./routers/userRoute.js"
import SeedInitalProducts from "./services/productService.js"
import productRouter from "./routers/productRoute.js"

const app = express();
const port = 3000;
app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log(`Mongo is connected`))
  .catch((err) => `Failed to connect due to ${err}`);




app.use('/user/',userRoute)
app.use('/products/',productRouter)

app.listen(port, () => {
  console.log(`Port is listening to port 3000
http://localhost:3000`);
});
