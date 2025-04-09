import { Router } from "express";
import uploadCloudinary from "./middlewares/cloudinary.js";
import { verifyToken } from "./middlewares/authorization.js";
import * as authController from "./controllers/auth.controller.js";
import * as userController from "./controllers/user.controller.js";

const router = Router();

// ROUTE FOR THE VERIFICATION OF THE SERVER 

router.get("/healthcheck", (request, response) => response.send("running"));

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE AUTH

// (Route for registration of users in Mongo DB) 
router.post(
  "/register",
  verifyToken,
  uploadCloudinary.single("profileImage"),
  authController.register
);
// router.post('/login', /* authController.login */)
router.post("/login-google", verifyToken, authController.loginGoogle);

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE USER

router.get("/me", verifyToken, userController.readAuthUser);
// router.patch('/me', /*verifyToken, userController.updateAuthUser */)
router.patch(
  "/me/image",
  verifyToken,
  uploadCloudinary.single("profileImage"),
  userController.updateAuthUserImage
);
// router.delete('/me', /*verifyToken, userController.destroyAuthUser */)

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE ADMIN

// router.get('/users', /* verifyToken, userController.readMultipleUsers */)
// router.get('/users/:userId', /* verifyToken, userController.readSingleUser */)

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE EXERCISES

// router.post('/exercises', /* exerciseController.createExercise */)
// router.get('/exercises', /* exerciseController.readMultipleExercises */)
// router.get('/exercises/:exerciseId', /* exerciseController.readSingleExercise */)
// router.patch('/exercises/:exerciseId', /* exerciseController.updateExercise */)
// router.delete('/exercises/:exerciseId', /* exerciseController.destroyExercise */)

export default router;

/* GET /users
GET /users?q=username
GET /users/:userId */
