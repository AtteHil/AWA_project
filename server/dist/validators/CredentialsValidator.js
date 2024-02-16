"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
const validateEmail = (0, express_validator_1.body)('email').isEmail().trim().escape();
exports.validateEmail = validateEmail;
const validatePassword = (0, express_validator_1.body)('password').isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});
exports.validatePassword = validatePassword;
