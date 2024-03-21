import { Router } from "express";
import { UserSchema } from "../users/model";
import userRepository from "../users/repository";

const controller = Router();

controller.post("/login", (req, res) => {
  const token = res.jwt({
    userId: 1,
  });

  res.json(token);
});

controller.post("/signin", (req, res) => {
  const { error, value } = UserSchema.validate(req.body);

  if (error) {
    throw error;
  }

  res.status(201).json(userRepository.add(value));
});

export default controller;
