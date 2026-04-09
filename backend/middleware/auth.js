import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const rawToken = req.headers.token || req.headers.authorization;
  const token = rawToken?.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please log in again." });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
export default authMiddleware;
