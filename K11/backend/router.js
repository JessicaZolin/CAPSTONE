import { Router } from "express";
import uploadCloudinary from "./middlewares/cloudinary.js";
import { verifyToken, verifyAdminRole } from "./middlewares/authorization.js";
import * as authController from "./controllers/auth.controller.js";
import * as userController from "./controllers/user.controller.js";
import * as exerciseController from "./controllers/exercise.controller.js";
import * as exerciseLogController from "./controllers/exerciseLog.controller.js";
import * as trainingPlanController from "./controllers/trainingPlan.controller.js";

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
router.post("/login-google", verifyToken, authController.loginGoogle);

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE USER

router.get("/me", verifyToken, userController.readAuthUser);
// router.patch('/me', verifyToken, cloudinary.single("profileImage"), userController.updateAuthUser)
router.patch(
  "/me/image",
  verifyToken,
  uploadCloudinary.single("profileImage"),
  userController.updateAuthUserImage
);
router.delete('/me', verifyToken, userController.destroyAuthUser)

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE ADMIN

router.get('/users', userController.readMultipleUsers)
router.get('/users/:userId', userController.readSingleUser)
router.patch('/users/:userId', userController.updateSingleUser)

// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE EXERCISES

router.post('/exercises', uploadCloudinary.single("cover"), exerciseController.createExercises)
router.get('/exercises', exerciseController.readMultipleExercises)
router.get('/exercises/:exerciseId', exerciseController.readSingleExercise)
router.patch('/exercises/:exerciseId', uploadCloudinary.single("cover"), exerciseController.updateSingleExercise)
router.delete('/exercises/:exerciseId', exerciseController.destroySingleExercise)


// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE USER EXERCISES
router.post('/exerciselogs/esercise/:exerciseId', exerciseLogController.createExerciseLog);
router.get('/exerciselogs/exercise/:exerciseId/:userId', exerciseLogController.readSingleUserExerciseLog);
router.delete('/exerciselogs/exercise/:exerciseId/:logId', exerciseLogController.destroySingleUserExerciseLog);


router.get('/exerciseslogs/see-all', verifyToken, verifyAdminRole, exerciseLogController.readMultipleExerciseLogs);


router.get('/exerciselogs/user/:userId', exerciseLogController.readSingleUserAllExerciseLogs);
//router.patch('/user-exercises/:exerciseId', verifyToken, exerciseController.updateSingleUserExercise) 


// ---------------------------------------------------------------------------------------------------------------

// ROUTE FOR THE TRAINING PLAN
router.post('/trainingplans', verifyToken, verifyAdminRole, trainingPlanController.createTrainingPlan)

export default router;

/* GET /users
GET /users?q=username
GET /users/:userId */
