import mongoose, { Document, Schema } from "mongoose"

interface IMessage {
    userId: string;
    message: string;
    date: Date;
  }
interface IMatches extends Document{
    userOne: string,
    userTwo: string, 
    chatLog: IMessage // store chat logs in an array
}
const messageSchema = new Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    date: {type: Date, required: true},
  });
let MatchesSchema: Schema = new Schema({
    userOne: {type: String},
    userTwo: {type: String},
    chatLog: [messageSchema]
})

const Match: mongoose.Model<IMatches> = mongoose.model<IMatches>('Match', MatchesSchema)

export { Match, IMatches }