const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("./config");
const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({});
  }
  let jwtToken = authorization.split(" ")[1];
  try {
    var decoded = jwt.verify(jwtToken, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({});
  }
};

module.exports = { authMiddleware };
