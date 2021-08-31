import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import ErrorParser from '../services/ErrorParser';

export default function validateReq(schema: Joi.Schema, property: 'body' | 'params') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);

    const valid = !error;
    if (valid) {
      next();
    } else {
      // console.error(error);
      res.status(422).json({ success: false, error: ErrorParser.parse(error) });
    }
  };
}
