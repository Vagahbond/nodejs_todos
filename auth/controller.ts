import { Router } from "express";
import { CreateUserValidationSchema } from "../users/model";
import userRepository from "../users/repository";
import { UnauthenticatedError } from "../utils/errors/authErrors";

const controller = Router();

controller.post("/login", (req, res, next) => {
  if (!req.body?.username || !req.body?.password) {
    throw new UnauthenticatedError("Please provide a username and a password.");
  }

  userRepository
    .getByUsername(req.body.username)
    .then((user) => {
      if (user.password !== req.body.password) {
        throw new UnauthenticatedError("Wrong password provided");
      }

      const token = res.jwt({
        id: user._id,
        role: user.role,
      });

      res.json(token);
    })
    .catch((e) => {
      next(new UnauthenticatedError(e.message));
    });
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
