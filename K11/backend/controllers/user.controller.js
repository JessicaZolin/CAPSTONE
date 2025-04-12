import User from "../models/User.js";
import { deleteUser } from "../middlewares/authorization.js";

// read logged in user
export async function readAuthUser(request, response, next) {
  // get the user from the request and search for the user in the database
  try {
    const { uid } = request.user;
    const user = await User.findOne({ firebaseUID: uid });
    response.send(user);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// update logged in user
export async function updateAuthUser(request, response, next) {
  try {
    const userModified = await User.findOneAndUpdate(
      { firebaseUID: request.user.uid },
      request.body,
      { new: true }
    );
    response.send(userModified);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// update logged in user image
export async function updateAuthUserImage(request, response, next) {
  console.log(request.file?.path);
  const userModified = await User.findOneAndUpdate(
    { firebaseUID: request.user.uid },
    { profileImage: request.file?.path || "" },
    { new: true }
  );
  response.send(userModified);
}

// -------------------------------------------------------------------------------------------------------------

// delete logged in user
export async function destroyAuthUser(request, response, next) {
  const deletedUser = await User.findOneAndDelete({
    firebaseUID: request.user.uid,
  });
  response.send(deletedUser);

  const deletedFirebaseUser = await deleteUser(request.user.uid);
  response.send(deletedFirebaseUser);
}

// -------------------------------------------------------------------------------------------------------------

// read multiple users
export async function readMultipleUsers(request, response, next) {
  const page = parseInt(request.query.page) || 1;
  const limitPerPage = parseInt(request.query.limit) || 6;
  if (limitPerPage > 6) limitPerPage = 6;
  const skip = (page - 1) * limitPerPage;

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limitPerPage);
  try {
    const users = await User.find()
      .sort({ lastName: "ascending" })
      .skip(skip)
      .limit(limitPerPage);
      
    console.log(users);
    response.send({page,
      currentPage: page,
      limitPerPage,
      totalPages,
      totalResources: totalUsers,
      users,
  });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// read single user
export async function readSingleUser(request, response, next) {}
