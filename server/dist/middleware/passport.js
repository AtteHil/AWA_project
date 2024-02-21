"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const Users_1 = require("../models/Users");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
passport_1.default.initialize(); // got help to turn weekly task passport to TypeScript from Aleksi Haapalainen
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET, // use secret from .env file (User has to set this .env file with SECRET=*Your own secret string*)
};
const jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        const user = await Users_1.User.findById(payload.id);
        // If user is found, authenticate the user
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
});
passport_1.default.use(jwtStrategy);
exports.default = passport_1.default;
