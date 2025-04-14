import { auth } from "./firebase.js";
import User from "../models/User.js";

// verify firebase token
export async function verifyToken(request, response, next) {
    // get the token from the headers
    const idToken = request.headers.authorization;
    console.log( "Token:", idToken);
  
    // check if the token is present in the headers
    if (!idToken) {
      return response.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      // verify the token
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log("Decoded token:", decodedToken);
  
      // add the user to the request
      request.user = decodedToken;
  
      // call the next middleware
      next();
    } catch (error) {
      console.log(error);
      response.status(401).json({ message: "Unauthorized" });
    }
  }

  export async function deleteUser (uid) {
    try {
      await auth.deleteUser(uid);
      console.log("User deleted successfully");
    } catch (error) {
      console.log(error);
    }
  }



  // verify admin role
  export async function verifyAdminRole(request, response, next) {
    const { user_id } = request.user;
    console.log("User ID:", user_id);
    const mongoUser = await User.findOne({ firebaseUID: user_id });
    console.log(mongoUser);
    const { role } = mongoUser;
    if (!mongoUser) {
      return response.status(404).json({ message: "User not found" });
    }
    if (role !== "admin") {
      return response.status(403).json({ message: "Forbidden" });
    }
    next();
  }