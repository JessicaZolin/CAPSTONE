import User from "../models/User.js";


// register a new user
export async function register(request, response, next) {

  // get the user from the request
  const { email, displayName, photoURL} = request.body.user;

  // get the token from the request.user given after the token verification
  const { uid } = request.user;

  // get the first and last name from the name and capitalize the first letter
  const firstName =
    displayName.split(" ")[0].charAt(0).toUpperCase() + displayName.split(" ")[0].slice(1);
  const lastName =
    displayName.split(" ")[1].charAt(0).toUpperCase() + displayName.split(" ")[1].slice(1);

  // check if the user already exists in the database with the firebaseUID
  let user = await User.findOne({ firebaseUID: uid });

  // if the user doesn't exist in the database, create a new user
  if (!user) {
    const newUser = new User({
      firstName,
      lastName,
      email,
      profileImage: photoURL,
      firebaseUID: uid,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "User created successfully", newUser });
  } else {
    response.status(200).json({ message: "User already exists", user });
  }
}

// -------------------------------------------------------------------------------------------------------------

// login a user with google
export async function loginGoogle(request, response, next) {

  // get the token, email, name and picture from the request. user given after the token verification
  const { uid, email, name, picture } = request.user;

  // get the first and last name from the name and capitalize the first letter
  const firstName =
    name.split(" ")[0].charAt(0).toUpperCase() + name.split(" ")[0].slice(1);
  const lastName =
    name.split(" ")[1].charAt(0).toUpperCase() + name.split(" ")[1].slice(1);

  // check if the user already exists in the database with the firebaseUID
  let user = await User.findOne({ firebaseUID: uid });

  if (!user) {
    // if the user doesn't exist in the database, create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      profileImage: picture,
      firebaseUID: uid,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "User created successfully", newUser });
  } else {
    // if the user exists, return the user
    response
      .status(200)
      .json({ message: "User logged in successfully", user });
  }
}
