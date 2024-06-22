//External Dependencies
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");

//Internal Dependencies
const seedRoutes = require("./src/routes/seed.route")
const userRoutes = require("./src/routes/users.route")
const authRoutes = require("./src/routes/auth.route.js")
const categoryRoutes = require("./src/routes/category.route.js")
const productyRoutes = require("./src/routes/product.route.js")
const routerLimiter = require("./src/middlewares/routeLimiter.middleware");
const {errorResponse} = require("./src/helpers/response.handlers")

//middelware use
app.use(routerLimiter(1,10)); //set requset limit to all route
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//application routes

app.use("/api/users",userRoutes);
app.use("/api/seed", seedRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/product',productyRoutes)

//client error handler (page not found 404)
app.use((req, res, next) => {
    throw createError(404, "page not found!");
});

//server error handler (500)
app.use((error, req, res, next) => {
  console.log(error);

  const statusCode = error.status;
  const errroMessage = error.message;

  return errorResponse(res, { statusCode, message : errroMessage });
});




module.exports = app;