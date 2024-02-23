import mongoose, { Document, Schema, Types } from "mongoose"

interface IUser extends Document {
    _id: Types.ObjectId;
    email: string,
    username: string,
    password: string,
    information: string, // Bio
    registerationdate: string, // registration date
    liked: string[] // store liked users to array
}

let userSchema: Schema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    information: { type: String, required: true },
    registerationdate: { type: String, required: true },
    liked: { type: [String], default: [] } // initial liked array empty
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema)

export { User, IUser }