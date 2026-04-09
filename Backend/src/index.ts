import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express";
import userRoute from "./routers/userRoute.js"
import productRouter from "./routers/productRoute.js"
import cartRouter from "./routers/cartRouter.js"
dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL || '')
  .then(() => console.log(`Mongo is connected`))
  .catch((err) => `Failed to connect due to ${err}`);

app.use('/user/',userRoute)
app.use('/product/',productRouter)
app.use('/cart/', cartRouter)
app.listen(port, () => {
  console.log(`Port is listening to port 3000
http://localhost:3000`);
});
