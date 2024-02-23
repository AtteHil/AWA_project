import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { User, IUser } from "../models/Users";
import dotenv from "dotenv";

dotenv.config();
passport.initialize();

const jwtOptions: StrategyOptions = { //token options set
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET as string, // use secret from .env file (User has to set this .env file with SECRET=*Your own secret string*)
};


const jwtStrategy = new Strategy(jwtOptions, async (payload, done) => { // Define a JWT strategy for Passport
    try {
        const user: IUser | null = await User.findById(payload.id);
        // If user is found, authenticate the user
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

passport.use(jwtStrategy);

export default passport;