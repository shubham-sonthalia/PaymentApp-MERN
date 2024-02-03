const express = require("express");
const router = express.Router();
const { Account } = require("./../db");
const { authMiddleware } = require("./../middleware");
const mongoose = require("mongoose");

async function updateAccount(from, to, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    amount = parseInt(amount);
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

router.get("/balance", authMiddleware, async (req, res) => {
  const accountDetail = await Account.findOne({ userId: req.userId });
  if (accountDetail) {
    res.json({ balance: accountDetail.balance });
  } else {
    return res.status(500, "User doesn't exist");
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const to = req.body.to;
  const amount = req.body.amount;
  const checkAccount = await Account.findOne({ userId: req.userId });
  if (checkAccount) {
    if (checkAccount.balance >= amount) {
      const checkIfUserExists = await Account.findOne({ userId: to });
      if (checkIfUserExists) {
        await updateAccount(req.userId, req.body.to, amount);
        res.json({ message: "Transfer successful" });
      } else {
        return res.status(400).send({
          message: "Invalid account",
        });
      }
    } else {
      return res.status(400).send({
        message: "Insufficient balance",
      });
    }
  }
});

module.exports = router;
