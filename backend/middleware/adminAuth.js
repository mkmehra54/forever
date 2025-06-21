import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expectedId = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

    if (decoded.id !== expectedId) {
      return res.status(403).json({ message: "Access denied, not an admin" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default adminAuth;
