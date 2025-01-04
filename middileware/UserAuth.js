import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()


const VerifyUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ statusCode: 403, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ statusCode: 401, error: "Unauthorized" });
    }

    req.user = { userId: decoded.id, email: decoded.email };
    next();
  });
};

export default VerifyUserToken;
