import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

// Middleware to check if user is Authenticated
export const protect = async (req, res, next)=> {
  const { userId } = req.auth;

  // Short-circuit when not authenticated
  if (!userId) {
    return res.json({ success: false, message: "Not authenticated" });
  }
  
  let user = await User.findById(userId);
  
  // If user doesn't exist in database, create them from Clerk data
  if (!user) {
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.create({
        _id: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.firstName + " " + clerkUser.lastName,
        image: clerkUser.imageUrl,
      });
    } catch (error) {
      return res.json({ success: false, message: "Unable to create user: " + error.message });
    }
  }
  
  req.user = user;
  next();
}