import express, { Request, Response, Express } from 'express'
import cors, { CorsOptions } from 'cors'
import mongoose, { Types } from "mongoose"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User, IUser } from "./models/Users"
import { Match, IMatches } from './models/Matches'
import bcrypt from 'bcrypt'
import validate from "./middleware/validator"
import dotenv from "dotenv"
import { validateEmail, validatePassword } from './validators/CredentialsValidator'
import { Result, ValidationError, validationResult } from 'express-validator'

dotenv.config();
const app: Express = express()
const port: Number = 3000
const corsOptions: CorsOptions = { origin: "http://localhost:5173", optionsSuccessStatus: 200 }
app.use(express.json())
app.use(cors(corsOptions));
mongoose.connect('mongodb://127.0.0.1:27017/project'); // adding mongoDB connection
mongoose.Promise = Promise
const db: mongoose.Connection = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))
db.on('connected', () => { console.log("Connected to DB") })
// start of the backend code

interface Profile { // interface for profile
  id: string,
  username: string,
  password: string,
  bio: string,
  liked: string[],
}


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


app.post("/register", validateEmail, validatePassword, async (req: Request, res: Response) => { // function to register new user and add them to mongoDB
  const errors: Result<ValidationError> = validationResult(req) // validaion results from email and password validator

  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() })
  }

  const { email, username, password, information, registrationdate }: { email: String, username: string, password: string, information: String, registrationdate: string } = req.body

  try {
    const existingEmail: IUser | null = await User.findOne({ email: req.body.email })
    if (existingEmail) {
      return res.status(403).send({ message: "Email already in use" })
    } else {
      const salt: string = bcrypt.genSaltSync(10) // use bcrypt to create salt and hash the password
      const hashedpassword: string = bcrypt.hashSync(password, salt);
      const newUser = new User({
        email: email,
        username: username,
        password: hashedpassword,
        information: information,
        registerationdate: registrationdate
      })
      await newUser.save();
      return res.status(200).json({ message: 'User registered successfully.' })
    }
  }
  catch (error: any) {
    console.log("error while registering", error)
    return res.status(500).send({ error })
  }


})

app.post("/login", async (req: Request, res: Response) => { // login function to compare given credentials to matching one in the mongoDB
  const { email, password }: { email: String, password: string } = req.body

  try {
    const existingUser: IUser | null = await User.findOne({ email: email })

    if (!existingUser) {
      return res.status(403).send({ message: "email" })
    } else {
      if (bcrypt.compareSync(password, existingUser.password)) {//compareSync because want to use async found here https://stackoverflow.com/questions/69324159/bcrypt-compare-or-bcrypt-comparesync
        const jwtPayload: JwtPayload = {
          id: existingUser._id,
          email: existingUser.email
        }
        const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: '30m' }); // make token for user to store in client side browser. Token expires in 30 minutes
        return res.status(200).send({ success: true, token })  // send token and success message to client side
      } else {
        return res.status(403).send({ message: "password" });
      }
    }
  }
  catch (error: any) {
    console.log("error while logging in", error)
    return res.status(500).send({ error })
  }


})



app.get("/Profile", validate, async (req: Request, res: Response) => { // checks that user is logged in and return the profile which can be used in frontpage
  if (req.user) {
    const user: Profile = req.user as Profile
    return (res.status(200).send(user))
  }
  else {
    return (res.status(401).send("UnAuhtorized"))
  }


})



app.post("/fetchUsers", validate, async (req: Request, res: Response) => { // function to fetch users from database to to user to swipe
  const user: Profile = req.user as Profile
  if (req.user) {
    // const loggedInUserId: string = (req.user as {_id: string})._id; 
    const loggedUser: Profile = await User.findById(user.id) as Profile
    try {
      const otherUsers: IUser[] = await User
        .find({
          _id: {
            $ne: loggedUser.id, // used for information https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
            $nin: loggedUser.liked
          } // Exclude users whose IDs are in the liked array
        })
        .select('username information registerationdate _id')

        .limit(50)
        .exec();

      res.status(200).json(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

});




app.post("/updateLiked", validate, async (req: Request, res: Response) => { // update liked arrey of currently logged in user on site

  const likedID: string = req.body._id
  if (req.user) {
    const user: Profile = req.user as Profile
    if (!user.liked.includes(likedID)) {
      try {
        const updatedUser = await User.findByIdAndUpdate(user.id, //if user is not already in liked push it to the liked array
          { $push: { liked: likedID } },
          { new: true }
        );
        const likedUser: Profile = await User.findById(likedID) as Profile; // find the profile which was just liked ///// Possible fault when changing to Profile
        if (likedUser.liked.includes(user.id)) { // check if the current user is in liked
          const match = new Match({// make match if user have liked bothways
            userOne: user.id,
            userNameOne: user.username,
            userTwo: likedID,
            userNameTwo: likedUser.username
          }).save()
          return res.status(200).send({ message: "Match" })// send match back
        }

        if (updatedUser) { // else send Liked back
          return res.status(200).send({ message: "Liked" });
        } else {
          return res.status(404).send("User not found");
        }
      } catch (error) {
        return res.status(500).send("Internal Server Error");
      }
    } else {
      return res.status(403).send("Unauthorized")
    }

  }
})




app.post("/ChatLogs", validate, async (req: Request, res: Response) => { // get's chat logs for single user with his ID
  if (req.user) {
    const user: Profile = req.user as Profile
    const userID: string = user.id;
    const chatLogs = await Match.find({ // find matches from match table where current user is either one of the users
      $or: [
        { userOne: userID },
        { userTwo: userID }
      ]
    })
    return res.send({ chatLogs, userID }) // send chatlogs and user id for checking message sender in front
  }

})



app.post("/message", validate, async (req: Request, res: Response) => { // pushes new message to database and also returns the updated chat Logs to user
  if (req.user) {
    const date: Date = new Date();
    const { chatID, message }: { chatID: string, message: string } = req.body

    const user: Profile = req.user as Profile
    const userID: string = user.id;
    try {
      const chatLogs = await Match.findByIdAndUpdate(chatID,
        { $push: { chatLog: { userId: userID, message: message, date: date } } },
        { new: true }
      )
      return res.json({ chatLogs }); // send back the new chatlog which can be updated to show on the front.
    }
    catch (error) {

    }

  }
})

app.post("/updateUser", validate, async (req: Request, res: Response) => { // update user with given information
  const { email, username, password, information, newPassword }: { email: String, username: string, password: string, information: String, newPassword: string | null } = req.body
  if (req.user) {
    const user: Profile = req.user as Profile
    let newHash: string | undefined
    if (bcrypt.compareSync(password, user.password)) {
      const salt: string = bcrypt.genSaltSync(10) // use bcrypt to create salt and hash the password 
      if (newPassword != null) {
        newHash = bcrypt.hashSync(newPassword, salt);
      }
      const updateFields: any = { email, username, information };
      if (newHash) {
        updateFields.password = newHash; // old password must be same so updates can be done safely.
      }

      const updatedUser = await User.findByIdAndUpdate(user.id,
        updateFields,
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else { res.status(401).send("Wrong password") }
  }
  else {
    res.status(401).send("UnAuhtorized")
  }


})
