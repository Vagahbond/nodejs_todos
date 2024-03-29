import { NextFunction, Request, Response } from "express";

export default function errorhandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (!err) {
    next();
  }

  switch (err.name) {
    case "UnauthenticatedError":
      res.status(401).json({
        message:
          err.message ?? "You must be authenticated to perform this action.",
      });
      break;
    case "UnauthorizedError":
      res.status(403).json({
        message:
          err.message ?? "You are not authorized to perform this action.",
      });
      break;
    case "ValidationError":
      res.status(400).json({ message: err.message });
      break;
    case "JWTExpressError":
      res.status(401).json({ message: "You are not authenticated." });
      break;

    default:
      console.log(err);
      res.status(500).json({ message: "Something went wrong." });
  }
}
