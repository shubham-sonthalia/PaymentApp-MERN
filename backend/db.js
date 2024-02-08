const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const userSchema = new mongoose.Schema({
  userName: String,
  firstName: String,
  lastName: String,
  password: String,
});

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});
const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
module.exports = { User, Account };
