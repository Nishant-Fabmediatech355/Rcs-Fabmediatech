import jwt from "jsonwebtoken";
import dotenv from 'dotenv'; 
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET

// Middleware to authenticate JWT token
const authenticate = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    jwt.verify(req.token, JWT_SECRET, (err, authData) => {
      if (err) {
        res
          .status(403)
          .json({ status: "Forbidden", data: "Invalid token or expired" });
      } else {
        req.authData = {
          userId: authData.user.userId,
          email: authData.user.email,
          role: authData.user.role,
        };
        next();
      }
    });
  } else {
    res.status(401).json({ status: false, data: "Token not provided" });
  }
};

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "7d" });
};
const generateTokenVerify = (user) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "1h" });
};
const verifyToken = (token) =>
  {
    return jwt.verify({token}, JWT_SECRET);
  }

export { authenticate, generateToken ,verifyToken,generateTokenVerify};
