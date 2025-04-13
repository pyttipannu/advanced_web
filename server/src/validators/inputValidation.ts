import { body } from 'express-validator';

export const validateRegisterInput = [
    body('username')
        .isLength({ min: 3, max: 25 })
        .trim()
        .escape(),
    body('password')
        .isLength({ min: 8 })
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[\W_]/)
        .trim()
        .escape(),
];

export const validateLoginInput = [
    body('username')
        .trim()
        .escape(),
    body('password')
        .trim()
        .escape(),
];