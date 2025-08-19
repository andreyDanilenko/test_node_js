import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ResponseHandler } from '../utils/response';
import { ValidationError } from '../utils/errors';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    ResponseHandler.error(res, new ValidationError('Validation failed'), 400);
    return;
  }
  next();
};

export const validate = (validations: any[]) => {
  return [...validations, handleValidationErrors];
};
