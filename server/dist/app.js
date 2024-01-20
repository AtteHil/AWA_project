"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Users_1 = require("./models/Users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("./middleware/validator"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const corsOptions = { origin: "http://localhost:5173", optionsSuccessStatus: 200 };
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
mongoose_1.default.connect('mongodb://127.0.0.1:27017/project');
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.on('connected', () => { console.log("Connected to DB"); });
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
app.get("/message", (req, res) => {
    res.json({ message: "Working message from backend" });
});
app.post("/isLogged", async (req, res) => {
    const token = req.body.token;
    if (token) {
    }
});
app.post("/register", async (req, res) => {
    const { email, password, information, registerationdate } = req.body;
    // console.log(req.body)
    try {
        const existingEmail = await Users_1.User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(403).send({ message: "Email already in use" });
        }
        else {
            const salt = bcrypt_1.default.genSaltSync(10);
            const hashedpassword = bcrypt_1.default.hashSync(password, salt);
            const newUser = new Users_1.User({
                email: email,
                password: hashedpassword,
                information: information,
                registerationdate: registerationdate
            });
            await newUser.save();
            return res.status(200).json({ message: 'User registered successfully.' });
        }
    }
    catch (error) {
        console.log("error while registering", error);
        return res.status(500).send({ error });
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await Users_1.User.findOne({ email: email });
        if (!existingUser) {
            return res.status(403).send({ message: "No user with this email" });
        }
        else {
            if (bcrypt_1.default.compareSync(password, existingUser.password)) { //compareSync because want to use async found here https://stackoverflow.com/questions/69324159/bcrypt-compare-or-bcrypt-comparesync
                const jwtPayload = {
                    id: existingUser._id,
                    email: existingUser.email
                };
                const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET);
                return res.status(200).send({ success: true, token });
            }
            else {
                return res.status(403).send({ message: "Incorrect password" });
            }
        }
    }
    catch (error) {
        console.log("error while logging in", error);
        return res.status(500).send({ error });
    }
});
app.post("/ownProfile", validator_1.default, async (req, res) => {
    console.log(req.user);
    res.send({ message: "jes" });
});
app.post("/fetchUsers", validator_1.default, async (req, res) => {
    console.log(req.user);
    res.send({ message: "jes" });
});
