import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export interface CustomRequest extends Request {
  userId?: string;
}
export const authMiddleware = (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    c.status(403);
    return c.json({});
  }
  let jwtToken = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET_KEY) as {
      [key: string]: any;
    };
    c.req.userId = decoded.userId;
    next();
  } catch (error) {
    c.status(403);
    return c.json({});
  }
};
