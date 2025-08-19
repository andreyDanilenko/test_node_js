import { body } from 'express-validator';

export const registrationValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const refreshTokenValidator = [
  body('refreshToken').notEmpty()
];

export const resetPasswordValidator = [
  body('email').isEmail().normalizeEmail(),
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 })
];
