"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewPassword = exports.validatePassword = exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
const validateEmail = (0, express_validator_1.body)('email').isEmail().trim().escape(); // validator to check email
exports.validateEmail = validateEmail;
const validatePassword = (0, express_validator_1.body)('password').isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});
exports.validatePassword = validatePassword;
const validateNewPassword = (0, express_validator_1.body)('newPassword').isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});
exports.validateNewPassword = validateNewPassword;
