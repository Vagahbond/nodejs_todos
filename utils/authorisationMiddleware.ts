import { NextFunction, Request, RequestHandler, Response } from "express";
import { Role } from "../users/model";
import { UnauthorizedError } from "./errors/authErrors";
import jwt from "jwt-express";

/**
 * Authorisation middleware
 * Dynamic middleware to check for a user's rights before proceeding to their request.
 * Uses `jwt-express` to check for the presence and validity of the JWT
 *
 * @param roles : Roles that should be able to perform this request
 * @returns  an array of middleware functions
 *
 **/
export default function authorize(
  roles: Array<Role> = Object.values(Role),
): Array<RequestHandler> {
  const roleHandler: RequestHandler = (
    req: Request,
    _: Response,
    next: NextFunction,
  ) => {
    try {
    } catch (e) {
      next(e);
      return;
    }
    if (!roles.includes(req.jwt.payload.role)) {
      throw new UnauthorizedError("You are not allowed to use this endpoint");
    }

    next();
  };

  return [jwt.active(), jwt.require("role"), jwt.require("id"), roleHandler];
}
