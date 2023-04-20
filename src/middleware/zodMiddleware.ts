import { AnyZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";
import HttpError from "./http-error";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate the request body against the schema and throw a ZodError if it does not pass
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      const error = new HttpError(
        "Invalid inputs passed, please check your data.",
        422
      );
      return next(error);
    }
  };
