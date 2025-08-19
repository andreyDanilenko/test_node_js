import { body } from 'express-validator';

export const createStickyNoteValidator = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Content must be less than 1000 characters'),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('Color must be a valid hex color'),
  body('positionX')
    .optional()
    .isInt()
    .withMessage('Position X must be an integer'),
  body('positionY')
    .optional()
    .isInt()
    .withMessage('Position Y must be an integer')
];

export const updateStickyNoteValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Content must be less than 1000 characters'),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('Color must be a valid hex color'),
  body('positionX')
    .optional()
    .isInt()
    .withMessage('Position X must be an integer'),
  body('positionY')
    .optional()
    .isInt()
    .withMessage('Position Y must be an integer')
];
