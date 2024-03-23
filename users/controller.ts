import { Router } from "express";
import authorize from "../utils/authorisationMiddleware";
import { Role } from "../users/model";
import { IUser, CreateUserValidationSchema } from "./model";
import repository from "./repository";

const controller = Router();

controller.get("/", authorize([Role.Admin]), (_, res) => {
  repository
    .getAll()
    .then((users: IUser[]) => {
      res.json(users);
    })
    .catch((err: Error) => {
      throw err;
    });
});

controller.get("/:id", authorize(), (req, res) => {
  if (
    req.jwt.payload.role === Role.User &&
    req.params.id === req.jwt.payload.id
  ) {
    throw new Error("You cannot look at other people's profile");
  }

  repository
    .get(req.params.id)
    .then((user: IUser) => {
      res.json(user);
    })
    .catch((err: Error) => {
      throw err;
    });
});

controller.post("/", authorize([Role.Admin]), (req, res) => {
  const { value, error } = CreateUserValidationSchema.validate(req.body);

  if (error) {
    throw error;
  }

  repository
    .add(value)
    .then((user: IUser) => {
      res.status(201).json(user);
    })
    .catch((err: Error) => {
      throw err;
    });
});

controller.put("/:id", authorize(), (req, res) => {
  const { value, error } = CreateUserValidationSchema.validate(req.body);

  if (error) {
    throw error;
  }

  repository
    .get(req.params.id)
    .then((user: IUser) => {
      if (
        user._id.toString() !== req.jwt.payload.id &&
        req.jwt.payload.role === Role.User
      ) {
        throw new Error("You cannot modify other people's profile");
      }

      repository
        .put(req.params.id, value)
        .then((user: IUser) => {
          res.json(user);
        })
        .catch((err: Error) => {
          throw err;
        });
    })
    .catch((err: Error) => {
      throw err;
    });
});

controller.delete("/:id", (req, res) => {
  repository
    .get(req.params.id)
    .then((user: IUser) => {
      if (
        user._id.toString() !== req.jwt.payload.id &&
        req.jwt.payload.role === Role.User
      ) {
        throw new Error("You cannot modify other people's profile");
      }

      repository
        .deleteOne(req.params.id)
        .then(() => {
          res.status(204).send();
        })
        .catch((err: Error) => {
          throw err;
        });
    })
    .catch((err: Error) => {
      throw err;
    });
});

export default controller;
