
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import passport from "./passport";
import dotenv from "dotenv";

dotenv.config();

export default function (req: Request, res: Response, next: NextFunction): void { // validator is cakked in app.ts backend side to validate the given token from user
    passport.authenticate('jwt', { session: false }, (err: Error | null, verified: JwtPayload | null) => {
        if (err || !verified) {
            return res.status(401).send();
        }
        req.user = verified;
        next();
    })(req, res, next);
}