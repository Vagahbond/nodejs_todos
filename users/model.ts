import joi from "joi";

export interface IUser {
  username: string;
  password: string;
}

export const UserSchema = joi.object({
  username: joi.string().alphanum().min(3).required(),
  password: joi.string().min(5).required(),
});

export const UpdateUserSchema = joi.object({
  password: joi.string().min(5).required(),
});
