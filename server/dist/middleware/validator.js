"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("./passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function default_1(req, res, next) {
    passport_1.default.authenticate('jwt', { session: false }, (err, verified) => {
        if (err || !verified) {
            return res.status(401).send();
        }
        req.user = verified;
        next();
    })(req, res, next);
}
exports.default = default_1;
