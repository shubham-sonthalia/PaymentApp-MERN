import dotenv from "dotenv";
dotenv.config();
import { Schema, model, connect } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new Schema({
  userName: String,
  firstName: String,
  lastName: String,
  password: String,
});

const accountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

run().catch((err) => console.log(err));
async function run() {
  await connect(MONGODB_URI);
}
export const User = model("User", userSchema);
export const Account = model("Account", accountSchema);
