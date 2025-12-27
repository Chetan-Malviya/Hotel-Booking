import User from "../models/User.js";

// Middleware to check if user is Authenticated
export const protect = async (req, res, next)=> {
  const { userId } = req.auth;

  // Short-circuit when not authenticated
  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const user = await User.findById(userId);

  // Guard against deleted / missing user records
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  req.user = user;
  next();
}