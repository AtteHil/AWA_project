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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const corsOptions = { origin: "http://localhost:5173", optionsSuccessStatus: 200 };
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
// const server = http.createServer(app);
// const io = new Server(server);
mongoose_1.default.connect('mongodb://127.0.0.1:27017/project'); // adding mongoDB connection
mongoose_1.default.Promise = Promise;
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.on('connected', () => { console.log("Connected to DB"); });
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
    const { email, username, password, information, registerationdate } = req.body;
    // console.log(" from registeration body ",req.body)
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
                const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET); // make token for user to store in client side browser
                return res.status(200).send({ success: true, token }); // send token and success message to client side
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
    // console.log(req.user);
    res.send({ message: "jes" });
});
app.post("/fetchUsers", validator_1.default, async (req, res) => {
    const user = req.user;
    if (req.user) {
        // const loggedInUserId: string = (req.user as {_id: string})._id; 
        const loggedUser = await Users_1.User.findById(user._id);
        try {
            const otherUsers = await Users_1.User
                .find({
                _id: { $ne: loggedUser._id, // used for information https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
                    $nin: loggedUser.liked } // Exclude users whose IDs are in the liked array
            })
                .select('username information registerationdate _id')
                .limit(50)
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
                const updatedUser = await Users_1.User.findByIdAndUpdate(user._id, { $push: { liked: likedID } }, { new: true });
                const likedUser = await Users_1.User.findById(likedID);
                if (likedUser.liked.includes(user._id)) {
                    const match = new Matches_1.Match({
                        userOne: user._id,
                        userTwo: likedID
                    }).save();
                    return res.status(200).send({ message: "Match" });
                }
                if (updatedUser) {
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
        console.log("Backarille tuli viesti");
        const user = req.user;
        const userID = user.id;
        console.log(userID);
        const chatLogs = await Matches_1.Match.find({
            $or: [
                { userOne: userID },
                { userTwo: userID }
            ]
        });
        return res.send({ chatLogs, userID });
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
            console.log(chatLogs);
            return res.json({ chatLogs });
        }
        catch (error) {
            console.log(error);
        }
    }
});
