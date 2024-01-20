import mongoose, { Document, Schema } from "mongoose"

interface IUser extends Document{
    email: string,
    password: string, 
    information: string, // Bio
    registerationdate: string, // date when user regeisters
    liked: string[] // store liked users to array
}

let userSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    information:{type: String, required: true},
    registerationdate:{type: String, required: true},
    liked:{type: [String], default: []} // initial liked array empty
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>('User', userSchema)

export { User, IUser }