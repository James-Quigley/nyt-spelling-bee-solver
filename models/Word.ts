import mongoose, { Schema, Document } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "";

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const wordSchema = new Schema({
  word: String,
  votes: Number,
});

interface IWord extends Document {
  word: string;
  votes: number;
}

const Word: mongoose.Model<IWord, {}, {}> =
  mongoose.models["Word"] || mongoose.model<IWord>("Word", wordSchema);
export default Word;
