import joi from "joi";

export interface ITodo {
  _id?: any;
  name: string;
  description: string;
  done: boolean;
  creator: string;
}

export const createTodoValidationSchema = joi.object({
  name: joi.string().max(32).min(3).required().description("Name of the todo"),
  description: joi.string().required().description("Description of the todo"),
  done: joi.boolean().required().description("Is the todo done"),
});

export const updateTodoValidationSchema = joi
  .object({
    name: joi
      .string()
      .max(32)
      .min(3)
      .optional()
      .description("Name of the todo"),
    description: joi.string().optional().description("Description of the todo"),
    done: joi.boolean().optional().description("Is the todo done"),
  })
  .min(1);
