import { Router } from "express";
import authorize from "../utils/authorisationMiddleware";
import { Role } from "../users/model";
import { ITodo, createTodoValidationSchema } from "./model";
import repository from "./repository";

const controller = Router();

controller.get("/", authorize(), (req, res) => {
  switch (req.jwt.payload.role) {
    case Role.Admin:
      repository
        .getAll()
        .then((todos: ITodo[]) => {
          res.json(todos);
        })
        .catch((err: Error) => {
          throw err;
        });

      break;

    case Role.User:
      repository
        .getForUser(req.jwt.payload.id)
        .then((todos: ITodo[]) => {
          res.json(todos);
        })
        .catch((err: Error) => {
          throw err;
        });

      break;
  }
});

controller.get("/:id", authorize(), (req, res) => {
  repository.get(req.params.id).then((todo: ITodo) => {
    if (
      todo._id.toString() !== req.jwt.payload.id &&
      req.jwt.payload.role === Role.User
    ) {
      throw new Error("You cannot look at other people's todo");
    }

    res.json(todo);
  });
});

controller.post("/", authorize(), (req, res) => {
  const { value, error } = createTodoValidationSchema.validate(req.body);

  if (error) {
    throw error;
  }

  repository
    .add(value)
    .then((todo: ITodo) => {
      res.status(201).json(todo);
    })
    .catch((err: Error) => {
      throw err;
    });
});

controller.put("/:id", authorize(), (req, res) => {
  const { value, error } = createTodoValidationSchema.validate(req.body);

  if (error) {
    throw error;
  }

  repository
    .get(req.params.id)
    .then((todo: ITodo) => {
      if (
        req.jwt.payload.role === Role.User &&
        todo.creator !== req.jwt.payload.id
      ) {
        throw new Error("You cannot modify other people's todo");
      }

      repository
        .put(req.params.id, value)
        .then((todo: ITodo) => {
          res.json(todo);
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
    .then((todo: ITodo) => {
      if (
        req.jwt.payload.role === Role.User &&
        todo.creator.toString() !== req.jwt.payload.id
      ) {
        throw new Error("You cannot modify other people's todo");
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
