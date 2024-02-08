const express = require("express");
require("dotenv").config();
const { User, Account } = require("./../db");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const bcrypt = require("bcrypt");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const router = express.Router();
const signUpSchema = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});
router.post("/signup", async (req, res) => {
  try {
    const isSuccess = signUpSchema.safeParse(req.body);
    if (!isSuccess) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }
    const userExists = await User.findOne({ userName: req.body.username });
    if (!userExists) {
      const user = new User({
        userName: req.body.username,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        password: req.body.password,
      });
      user.save();
      const account = new Account({
        balance: 1 + Math.random() * 10000,
        userId: user._id,
      });
      account.save();
      return res.json({
        message: "User created successfully",
        token: jwt.sign({ userId: user._id }, JWT_SECRET_KEY),
      });
    } else {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
const signInObject = zod.object({
  username: zod.string(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const isSuccess = signInObject.safeParse(req.body);
  if (!isSuccess) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const { username, password } = req.body;
  const userDetails = await User.findOne({ userName: username });
  if (!userDetails) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }
  if (password == userDetails.password) {
    return res.json({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      token: jwt.sign({ userId: userDetails._id }, JWT_SECRET_KEY),
    });
  } else {
    return res.json({ success: false, message: "passwords do not match" });
  }
  // bcrypt.compare(password, userDetails.password, function (err, response) {
  //   if (err) {
  //     return res.status(411).json({ message: "Error authenticating" });
  //   }
  //   if (response) {
  //     return res.json({
  //       firstName: userDetails.firstName,
  //       lastName: userDetails.lastName,
  //       token: jwt.sign({ userId: userDetails._id }, JWT_SECRET_KEY),
  //     });
  //   } else {
  //     return res.json({ success: false, message: "passwords do not match" });
  //   }
  // });
  // bcrypt.compare(
  //   JWT_SECRET_KEY,
  //   userDetails.password,
  //   function (err, response) {
  //     if (response == true) {
  //       return res.json({
  //         firstName: userDetails.firstName,
  //         lastName: userDetails.lastName,
  //         token: jwt.sign({ userId: userDetails._id }, JWT_SECRET_KEY),
  //       });
  //     } else {
  //       return res.status(411).json({
  //         message: "Error while logging in",
  //       });
  //     }
  //   }
  // );
});
const updateObject = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});
router.put("/", async (req, res) => {
  const { isSuccess } = updateObject.safeParse(req.body);
  if (!isSuccess) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  const userId = req.userId;
  try {
    await User.updateOne({ _id: userId }, req.body);
  } catch (err) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  res.json({
    message: "Updated successfully",
  });
});
router.get("/bulk", async (req, res) => {
  let filter = req.query.filter || "";
  const matchingUsers = await User.find(
    {
      firstName: { $regex: filter },
      lastName: { $regex: filter },
    },
    { password: 0, __v: 0 }
  );
  res.json({ users: matchingUsers });
});

module.exports = router;
