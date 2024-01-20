
import { Request, Response, NextFunction } from "express";
import jwt,{JwtPayload} from "jsonwebtoken";
import passport from "./passport";
import dotenv from "dotenv";

dotenv.config();

export default function(req: Request, res: Response, next: NextFunction): void { // function to validate user if he has real token or not
    passport.authenticate('jwt', { session: false }, (err: Error | null, verified: JwtPayload | null) => {
        if (err || !verified) {
            return res.status(401).send();
        }
        req.user = verified;
        next();
    })(req, res, next);
}