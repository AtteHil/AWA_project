import { ValidationChain, body } from "express-validator"

const validateEmail: ValidationChain = body('email').isEmail().trim().escape()

const validatePassword: ValidationChain = body('password').isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
})

export { validateEmail, validatePassword }