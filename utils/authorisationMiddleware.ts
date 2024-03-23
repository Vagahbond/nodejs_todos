import { NextFunction, Request, Response } from "express";
import { Role } from "../users/model";

export default function authorize(roles: Array<Role> = Object.values(Role)) {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!roles.includes(req.jwt.payload.role)) {
      throw new Error();
    }

    next();
  };
}
