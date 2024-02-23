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
const Matches_1 = require("./models/Matches");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("./middleware/validator"));
const dotenv_1 = __importDefault(require("dotenv"));
const CredentialsValidator_1 = require("./validators/CredentialsValidator");
const express_validator_1 = require("express-validator");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const corsOptions = { origin: "http://localhost:5173", optionsSuccessStatus: 200 };
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
mongoose_1.default.connect('mongodb://127.0.0.1:27017/project'); // adding mongoDB connection
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.on('connected', () => { console.log("Connected to DB"); });
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
app.post("/register", CredentialsValidator_1.validateEmail, CredentialsValidator_1.validatePassword, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req); // validaion results from email and password validator
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    const { email, username, password, information, registrationdate } = req.body;
    try {
        const existingEmail = await Users_1.User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(403).send({ message: "Email already in use" });
        }
        else {
            const salt = bcrypt_1.default.genSaltSync(10); // use bcrypt to create salt and hash the password
            const hashedpassword = bcrypt_1.default.hashSync(password, salt);
            const newUser = new Users_1.User({
                email: email,
                username: username,
                password: hashedpassword,
                information: information,
                registerationdate: registrationdate
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
            return res.status(403).send({ message: "email" });
        }
        else {
            if (bcrypt_1.default.compareSync(password, existingUser.password)) { //compareSync because want to use async found here https://stackoverflow.com/questions/69324159/bcrypt-compare-or-bcrypt-comparesync
                const jwtPayload = {
                    id: existingUser._id,
                    email: existingUser.email
                };
                const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: '30m' }); // make token for user to store in client side browser. Token expires in 30 minutes
                return res.status(200).send({ success: true, token }); // send token and success message to client side
            }
            else {
                return res.status(403).send({ message: "password" });
            }
        }
    }
    catch (error) {
        console.log("error while logging in", error);
        return res.status(500).send({ error });
    }
});
app.get("/Profile", validator_1.default, async (req, res) => {
    if (req.user) {
        const user = req.user;
        return (res.status(200).send(user));
    }
    else {
        return (res.status(401).send("UnAuhtorized"));
    }
});
app.post("/fetchUsers", validator_1.default, async (req, res) => {
    const user = req.user;
    if (req.user) {
        const loggedUser = await Users_1.User.findById(user.id);
        try {
            const otherUsers = await Users_1.User
                .find({
                _id: {
                    $ne: loggedUser.id, // used for information https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
                    $nin: loggedUser.liked
                } // Exclude users whose IDs are in the liked array
            })
                .select('username information registerationdate _id')
                .limit(50) // fetch max 50 users
                .exec();
            res.status(200).json(otherUsers);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
app.post("/updateLiked", validator_1.default, async (req, res) => {
    const likedID = req.body._id;
    if (req.user) {
        const user = req.user;
        if (!user.liked.includes(likedID)) {
            try {
                const updatedUser = await Users_1.User.findByIdAndUpdate(user.id, //if user is not already in liked push it to the liked array
                { $push: { liked: likedID } }, { new: true });
                const likedUser = await Users_1.User.findById(likedID); // find the profile which was just liked ///// Possible fault when changing to Profile
                if (likedUser.liked.includes(user.id)) { // check if the current user is in liked
                    const match = new Matches_1.Match({
                        userOne: user.id,
                        userNameOne: user.username,
                        userTwo: likedID,
                        userNameTwo: likedUser.username
                    }).save();
                    return res.status(200).send({ message: "Match" }); // send match back
                }
                if (updatedUser) { // else send Liked back
                    return res.status(200).send({ message: "Liked" });
                }
                else {
                    return res.status(404).send("User not found");
                }
            }
            catch (error) {
                return res.status(500).send("Internal Server Error");
            }
        }
        else {
            return res.status(403).send("Unauthorized");
        }
    }
});
app.post("/ChatLogs", validator_1.default, async (req, res) => {
    if (req.user) {
        const user = req.user;
        const userID = user.id;
        const chatLogs = await Matches_1.Match.find({
            $or: [
                { userOne: userID },
                { userTwo: userID }
            ]
        });
        return res.send({ chatLogs, userID }); // send chatlogs and user id for checking message sender in frontend
    }
});
app.post("/message", validator_1.default, async (req, res) => {
    if (req.user) {
        const date = new Date();
        const { chatID, message } = req.body;
        const user = req.user;
        const userID = user.id;
        try {
            const chatLogs = await Matches_1.Match.findByIdAndUpdate(chatID, { $push: { chatLog: { userId: userID, message: message, date: date } } }, { new: true });
            return res.json({ chatLogs }); // send back the new chatlog which can be updated to show on the front.
        }
        catch (error) {
        }
    }
});
app.post("/updateUser", validator_1.default, CredentialsValidator_1.validateEmail, CredentialsValidator_1.validateNewPassword, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req); // validaion results from email and password validator
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    const { email, username, password, information, newPassword } = req.body;
    if (req.user) {
        const user = req.user;
        let newHash;
        if (bcrypt_1.default.compareSync(password, user.password)) {
            const salt = bcrypt_1.default.genSaltSync(10); // use bcrypt to create salt and hash the password 
            if (newPassword != null) {
                newHash = bcrypt_1.default.hashSync(newPassword, salt);
            }
            const updateFields = { email, username, information };
            if (newHash) {
                updateFields.password = newHash; // old password must be same so updates can be done safely.
            }
            const updatedUser = await Users_1.User.findByIdAndUpdate(user.id, updateFields, { new: true });
            await Matches_1.Match.updateMany(// update the matches username where this user is
            { userOne: user.id }, { $set: { userNameOne: updateFields.username } });
            await Matches_1.Match.updateMany({ userTwo: user.id }, { $set: { userNameTwo: updateFields.username } });
            res.status(200).json(updatedUser); // send back updated user information
        }
        else {
            res.status(401).send("Wrong password");
        }
    }
    else {
        res.status(401).send("UnAuhtorized");
    }
});
