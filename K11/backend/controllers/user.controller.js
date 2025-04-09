import User from "../models/User.js";

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

// update logged in user
export async function updateAuthUser(request, response, next) {}

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

// delete logged in user
export async function destroyAuthUser(request, response, next) {}

// read multiple users
export async function readMultipleUsers(request, response, next) {}

// read single user
export async function readSingleUser(request, response, next) {}
