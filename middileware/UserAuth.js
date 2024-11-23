import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const VerifyUserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).send({ error: "no token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ error: "unauthorized." });
    }
    
    req.user = { userId: decoded.id, email: decoded.email };
    next();
  });
};

export default VerifyUserToken;
