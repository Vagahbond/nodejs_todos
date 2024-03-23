import joi from "joi";

export enum Role {
  User = "user",
  Admin = "admin",
}

interface IPassword {
  hash: string;
  salt: string;
}

export interface IUser {
  _id?: any;
  username: string;
  password: IPassword;
  role: Role;
}

export const CreateUserValidationSchema = joi.object({
  username: joi.string().alphanum().min(3).required(),
  password: joi.string().min(5).required(),
  role: joi
    .string()
    .regex(/user|admin|staff/)
    .required(),
});

export const UpdateUserValidationSchema = joi.object({
  password: joi.string().min(5).required(),
});
