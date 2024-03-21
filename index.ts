import express from "express";
import todoController from "./todo/controller";
import logsMiddleware from "./utils/logsHandler";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(logsMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

app.use("/todos", todoController);

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
