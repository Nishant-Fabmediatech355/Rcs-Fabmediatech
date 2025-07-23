import jwt from "jsonwebtoken";
const JWT_SECRET = "JFJFYWUJDFEWUJFYGVJFCJVCDCVJSAGCASIUD";

export const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        message: "Token expired. Please refresh token.",
      });
    }
    res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};
