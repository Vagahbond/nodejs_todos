import express from "express";
import todoController from "./todo/controller";
import authController from "./auth/controller";
import userController from "./users/controller";
import logsMiddleware from "./utils/logsHandler";
import bodyParser from "body-parser";
import jwt from "jwt-express";
import errorHandler from "./utils/errorHandler";
import { getConfig } from "./utils/configHandler";

const app = express();

app.use(bodyParser.json());
app.use(logsMiddleware);
app.use(
  jwt.init(getConfig().jwtSecret, {
    cookies: false,
  }),
);

app.get("/", (_req, res) => {
  res.json({ message: "Hello world!" });
});

app.use("/todos", todoController);
app.use("/users", userController);
// app.use("/auth", authController);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
