import { Router } from "express";
import { CreateUserValidationSchema } from "../users/model";
import userRepository from "../users/repository";

const controller = Router();

controller.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    throw new Error();
  }

  const user = userRepository.get("username", req.body.username);

  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.password !== req.body.password) {
    throw new Error("Wrong password provided");
  }

  const token = res.jwt({
    id: user.id,
    role: user.role,
  });

  res.json(token);
});

controller.post("/signin", (req, res) => {
  const { error, value } = CreateUserValidationSchema.validate(req.body);

  if (userRepository.get("username", value.username)) {
    throw new Error();
  }

  if (error) {
    throw error;
  }

  res.status(201).json(userRepository.add(value));
});

export default controller;
