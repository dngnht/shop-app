//const userRouter = require("./user");
const authRouter = require("./auth");
const productRouter = require("./products");
const cartRouter = require("./cart");
const adminRouter = require("./admin");
const userRouter = require("./user");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api", productRouter);
  app.use("/api", cartRouter);
  app.use("/api/user", userRouter);
  app.use("/api/admin", adminRouter);
}

module.exports = route;
