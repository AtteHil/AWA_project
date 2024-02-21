import { ValidationChain, body } from "express-validator"

const validateEmail: ValidationChain = body('email').isEmail().trim().escape() // validator to check email

const validatePassword: ValidationChain = body('password').isStrongPassword({ // validator to check password
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
})

export { validateEmail, validatePassword }