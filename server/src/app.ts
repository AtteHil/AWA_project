import express, { Request, Response, Express} from 'express'
import cors, { CorsOptions } from 'cors'
import mongoose, { Types } from "mongoose"
import jwt, {JwtPayload} from "jsonwebtoken"
import { User, IUser } from "./models/Users"
import { Match, IMatches } from './models/Matches'
import bcrypt from 'bcrypt'
import validate from "./middleware/validator"
import dotenv from "dotenv";


dotenv.config();
const app: Express= express()
const port: Number = 3000
const corsOptions: CorsOptions = {origin: "http://localhost:5173", optionsSuccessStatus: 200}
app.use(express.json())
app.use(cors(corsOptions));
// const server = http.createServer(app);
// const io = new Server(server);
mongoose.connect('mongodb://127.0.0.1:27017/project'); // adding mongoDB connection
mongoose.Promise = Promise
const db:mongoose.Connection = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))
db.on('connected', ()=>{console.log("Connected to DB")})
// start of the backend code

interface Profile {
  id: string,
  username: string,
  password: string,

}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.get("/message", (req: Request, res:Response)=>{
    res.json({message: "Working message from backend"})
})

app.post("/isLogged", async(req:Request, res: Response)=> {
  const token: string = req.body.token;
  if(token){

  }
})
app.post("/register",async (req: Request, res: Response) =>{ // function to register new user and add them to mongoDB
    const {email,username, password, information, registerationdate}: {email: String, username: string, password: string, information: String, registerationdate: string}=req.body
    // console.log(" from registeration body ",req.body)
    try{
      const existingEmail: IUser | null = await User.findOne({ email: req.body.email })
      if(existingEmail){
        return res.status(403).send({message: "Email already in use"})
      } else {
        const salt: string = bcrypt.genSaltSync(10) // use bcrypt to create salt and hash the password
        const hashedpassword: string = bcrypt.hashSync(password, salt);
        const newUser = new User({
          email: email,
          username: username,
          password: hashedpassword,
          information: information,
          registerationdate: registerationdate
        })
        await newUser.save();
        return res.status(200).json({ message: 'User registered successfully.'})
      }}
    catch(error: any){
      console.log("error while registering", error)
      return res.status(500).send({error})
    }
    
    
})

app.post("/login",async (req: Request, res: Response) =>{ // login function to compare given credentials to matching one in the mongoDB
  const {email, password}: {email: String, password: string}=req.body
  
  try{
    const existingUser: IUser | null = await User.findOne({ email: email })
   
    if(!existingUser){
      return res.status(403).send({message: "No user with this email"})
    } else {
      if(bcrypt.compareSync(password, existingUser.password)){//compareSync because want to use async found here https://stackoverflow.com/questions/69324159/bcrypt-compare-or-bcrypt-comparesync
        const jwtPayload: JwtPayload = {
          id: existingUser._id,
          email: existingUser.email
        }
        const token: string = jwt.sign(jwtPayload, process.env.SECRET as string); // make token for user to store in client side browser
        return res.status(200).send({ success: true, token })  // send token and success message to client side
      } else{
        return res.status(403).send({message: "Incorrect password"});
      }
    }}
  catch(error: any){
    console.log("error while logging in", error)
    return res.status(500).send({error})
  }
  
  
})



app.post("/ownProfile",validate,async (req: Request, res: Response) =>{ // checks that user is logged in
  // console.log(req.user);
  res.send({message:"jes"})
})



app.post("/fetchUsers", validate, async (req: Request, res: Response) =>{ // function to fetch users from database to to user to swipe
  const user: any = req.user
  if(req.user){
    // const loggedInUserId: string = (req.user as {_id: string})._id; 
    const loggedUser: any  = await User.findById(user._id)
  try {
    const otherUsers: IUser[] = await User
      .find({ 
        _id: { $ne: loggedUser._id, // used for information https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
              $nin: loggedUser.liked } // Exclude users whose IDs are in the liked array
      })
      .select('username information registerationdate _id' )
      
      .limit(50)
      .exec();

    res.status(200).json(otherUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }}

});




app.post("/updateLiked",validate, async (req:Request, res:Response)=> {
  
  const likedID:string = req.body._id 
  if(req.user){
    const user: any = req.user
    if(!user.liked.includes(likedID)){
      try {
        const updatedUser = await User.findByIdAndUpdate(user._id,
          { $push: { liked: likedID } },
          { new: true }
        );
        const likedUser: any = await User.findById(likedID);
        if(likedUser.liked.includes(user._id)){
          const match = new Match({
            userOne: user._id,
            userTwo: likedID
          }).save()
          return res.status(200).send({message: "Match"})
        }
    
        if (updatedUser) {
          return res.status(200).send({message: "Liked"});
        } else {
          return res.status(404).send("User not found");
        }
      } catch (error) {
        return res.status(500).send("Internal Server Error");
      }
    } else {
      return res.status(403).send("Unauthorized")
    }

}})




app.post("/ChatLogs",validate, async (req:Request, res: Response) => { // get's chat logs for single user with his ID
  if(req.user){
    console.log("Backarille tuli viesti")
    const user: Profile = req.user as Profile
    const userID: string = user.id;
    console.log(userID);
    const chatLogs = await Match.find({
      $or: [
        { userOne: userID },
        { userTwo: userID }
      ]
    })
    
    return res.send({chatLogs, userID})
  }
  
})



app.post("/message",validate, async (req:Request, res: Response) => { // pushes new message to database and also returns the updated chat Logs to user
  if(req.user){
    const date: Date = new Date();
    const {chatID, message}: {chatID: string, message: string}=req.body
    
    const user: Profile = req.user as Profile
    const userID: string = user.id;
    try {
      const chatLogs = await Match.findByIdAndUpdate(chatID,
      { $push: { chatLog: {userId: userID,message: message, date: date} } },
      { new: true }
      )
      console.log(chatLogs)
      return res.json({ chatLogs });
    }  
    catch(error) {
      console.log(error)
    }

  }
})
