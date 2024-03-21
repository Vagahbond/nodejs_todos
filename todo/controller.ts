import { Router } from "express";
import todoRepository from "./repository";
import { toDoSchema, updateToDoSchema } from "./model";

const controller = Router();

controller.get("/", (req, res) => {
  res.json(todoRepository.getAll());
});

controller.get("/:id", (req, res) => {
  const todo = todoRepository.get(Number.parseInt(req.params.id));

  if (!todo) {
    res.status(404).json({ message: "Todo does not exist" });
  }

  res.json(todo);
});

controller.post("/", (req, res) => {
  const { error, value } = toDoSchema.validate(req.body);

  if (error) {
    res.status(400);
    res.json({ message: error.message });
    return;
  }

  res.status(201).json(todoRepository.add(value));
});

controller.patch("/:id", (req, res) => {
  const todo = todoRepository.get(Number.parseInt(req.params.id));

  if (!todo) {
    res.status(404);
    res.json({ message: "Todo does not exist" });
    return;
  }

  const { error, value } = updateToDoSchema.validate(req.body);

  if (error) {
    res.status(400);
    res.json({ message: error.message });
    return;
  }

  res.json(todoRepository.put(Number.parseInt(req.params.id), value));
});

controller.delete("/:id", (req, res) => {
  const todo = todoRepository.get(Number.parseInt(req.params.id));
  if (!todo) {
    res.status(404);
    res.json({ message: "Todo does not exist" });
    return;
  }

  todoRepository.delete(Number.parseInt(req.params.id));
  res.status(201).send();
});

export default controller;
