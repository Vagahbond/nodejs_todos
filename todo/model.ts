import joi from "joi";

export interface IToDo {
  name: string;
  description: string;
  done: boolean;
}

export const toDoSchema = joi.object({
  name: joi.string().max(32).min(3).required().description("Name of the todo"),
  description: joi.string().required().description("Description of the todo"),
  done: joi.boolean().required().description("Is the todo done"),
});

export const updateToDoSchema = joi.object({
  name: joi.string().max(32).min(3).optional().description("Name of the todo"),
  description: joi.string().optional().description("Description of the todo"),
  done: joi.boolean().optional().description("Is the todo done"),
}).min(1);
