import { Hono } from "hono";
import { userRouter } from "./user";
import { accountRouter } from "./account";

const router = new Hono();

router.route("/user", userRouter);
router.route("/account", accountRouter);

export const mainRouter = router;
