import { Hono } from "hono";
const router = new Hono();
import { Account } from "./../db";
const { authMiddleware } = require("./../middleware");
import { CustomRequest } from "./../middleware";
const mongoose = require("mongoose");

async function updateAccount(from: string, to: string, amount: number) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    await Account.updateOne(
      { userId: new mongoose.Types.ObjectId(from) },
      { $inc: { balance: -amount } },
      opts
    );
    await Account.updateOne(
      { userId: new mongoose.Types.ObjectId(to) },
      { $inc: { balance: amount } },
      opts
    );
    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

router.get("/balance", authMiddleware, async (c) => {
  const req = await c.req.parseBody();
  const accountDetail = await Account.findOne({
    userId: req.userId,
  });
  if (accountDetail) {
    c.json({ balance: accountDetail.balance });
  } else {
    c.status(500);
    return c.json({
      msg: "User doesn't exist",
    });
  }
});

router.post("/transfer", authMiddleware, async (c) => {
  const req = await c.req.parseBody();
  const to = req.to;
  const amount = parseInt(req.amount.toString());
  const checkAccount = await Account.findOne({ userId: req.userId });
  if (checkAccount) {
    if (checkAccount.balance >= amount) {
      const checkIfUserExists = await Account.findOne({ userId: to });
      if (checkIfUserExists) {
        await updateAccount(req.userId.toString(), req.to.toString(), amount);
        c.json({ message: "Transfer successful" });
      } else {
        c.status(400);
        return c.json({
          message: "Invalid account",
        });
      }
    } else {
      c.status(400);
      return c.json({
        message: "Insufficient balance",
      });
    }
  }
});

export const accountRouter = router;
