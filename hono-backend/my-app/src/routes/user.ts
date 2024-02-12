import { Hono } from "hono";
import dotenv from "dotenv";
dotenv.config();
import { User, Account } from "./../db";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
import bcrypt from "bcrypt";
import zod from "zod";
import jwt from "jsonwebtoken";
const router = new Hono();
const signUpSchema = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});
router.post("/signup", async (c) => {
  try {
    const req = await c.req.parseBody();
    const isSuccess = signUpSchema.safeParse(req);
    if (!isSuccess) {
      c.status(411);
      return c.json({
        message: "Email already taken / Incorrect inputs",
      });
    }
    const userExists = await User.findOne({
      userName: req.username,
    });
    if (!userExists) {
      const user = new User({
        userName: req.username,
        firstName: req.firstname,
        lastName: req.lastname,
        password: req.password,
      });
      user.save();
      const account = new Account({
        balance: 1 + Math.random() * 10000,
        userId: user._id,
      });
      account.save();
      return c.json({
        message: "User created successfully",
        token: jwt.sign({ userId: user._id }, JWT_SECRET_KEY),
      });
    } else {
      c.status(411);
      return c.json({
        message: "Email already taken / Incorrect inputs",
      });
    }
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Internal Server Error",
    });
  }
});
const signInObject = zod.object({
  username: zod.string(),
  password: zod.string(),
});
router.post("/signin", async (c) => {
  const req = await c.req.parseBody();
  const isSuccess = signInObject.safeParse(req);
  if (!isSuccess) {
    c.status(411);
    return c.json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const { username, password } = req;
  const userDetails = await User.findOne({ userName: username });
  if (!userDetails) {
    c.status(411);
    return c.json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  if (password == userDetails.password) {
    return c.json({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      token: jwt.sign({ userId: userDetails._id }, JWT_SECRET_KEY),
    });
  } else {
    c.status(411);
    return c.json({
      success: false,
      message: "passwords do not match",
    });
  }
});
const updateObject = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});
router.put("/", async (c) => {
  const req = await c.req.parseBody();
  const isSuccess = updateObject.safeParse(req);
  if (!isSuccess) {
    c.status(411);
    c.json({
      message: "Error while updating information",
    });
  }
  const userId = req.userId;
  try {
    await User.updateOne({ _id: userId }, req);
  } catch (err) {
    c.status(411);
    c.json({
      message: "Error while updating information",
    });
  }
  c.json({
    message: "Updated successfully",
  });
});
router.get("/bulk", async (c) => {
  const filter = c.req.query("filter") || "";
  const matchingUsers = await User.find(
    {
      firstName: { $regex: filter },
      lastName: { $regex: filter },
    },
    { password: 0, __v: 0 }
  );
  c.json({ users: matchingUsers });
});

export const userRouter = router;
