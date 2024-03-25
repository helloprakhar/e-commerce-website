const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");

require("dotenv/config");

const url = process.env.URL;

//Middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use("/public", express.static(path.join("public")));

//Routers
const itemsRouter = require("./routers/itemRoutes");
app.use(url + "/items", itemsRouter);

const categoryRouter = require("./routers/categoryRoutes");
app.use(url + "/category", categoryRouter);

const userRouter = require("./routers/userRoutes");
app.use(url + "/users", userRouter);

const cartRouter = require("./routers/cartRoutes");
app.use(url + "/cart", cartRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to database successfull !");
  })
  .catch(() => {
    console.log("Connection to database failed :/");
  });

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log("Express is running on port " + process.env.PORT);
});
