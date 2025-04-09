import { auth } from "./firebase.js";

// verify firebase token
export async function verifyToken(request, response, next) {
    // get the token from the headers
    const idToken = request.headers.authorization;
    console.log(idToken);
  
    // check if the token is present in the headers
    if (!idToken) {
      return response.status(401).json({ message: "Unauthorized" });
    }
  
    try {
      // verify the token
      const decodedToken = await auth.verifyIdToken(idToken);
  
      // add the user to the request
      request.user = decodedToken;
  
      // call the next middleware
      next();
    } catch (error) {
      console.log(error);
      response.status(401).json({ message: "Unauthorized" });
    }
  }