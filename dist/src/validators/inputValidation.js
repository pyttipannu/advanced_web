"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginInput = exports.validateRegisterInput = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegisterInput = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .trim()
        .escape(),
    (0, express_validator_1.body)('username')
        .isLength({ min: 3, max: 25 })
        .trim()
        .escape(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[\W_]/)
        .trim()
        .escape(),
];
exports.validateLoginInput = [
    (0, express_validator_1.body)('username')
        .trim()
        .escape(),
    (0, express_validator_1.body)('password')
        .trim()
        .escape(),
];
