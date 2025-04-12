import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signInWithPopup,
  getRedirectResult,
  updateProfile,
} from "firebase/auth";
import axios from "axios";

// create a context for authentication
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);

  // -------------------------------------------------------- monitor authentication state
  useEffect(() => {
    /* let isMounted = true; */
    // Gestisce il risultato del redirect quando l'utente torna
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
          console.log("Redirect successful:", result.user);
        }
      } catch (error) {
        console.error("Redirect error:", error);
      }
    };
    handleRedirectResult();

    // ---------------------------------------------------------------------------------------

    const fetchUserData = async (token) => {
      console.log("Token:", token);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        console.log("User data from backend:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // ---------------------------------------------------------------------------------------

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const token = await currentUser.getIdToken();
          setUser(currentUser);
          setToken(token);
          const mongoUserIN = await fetchUserData(token);
          if (mongoUserIN) {
            console.log("Mongo user:", mongoUserIN);
            setMongoUser(mongoUserIN);
            setLoading(false);
          }
        } else {
          setUser(null);
          setToken(null);
          setMongoUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.log("User state changed error:", error);
        setLoading(false);
      }
    });

    // cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  // Force loading to false if compnent unmount
  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  // -------------------------------------------------------------------------------------------------------------

  // Google Sign In
  const googleSignIn = async () => {
    try {
      // create a new instance of GoogleAuthProvider and set the opportunity to choose the user every time the user use this authentication method
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      // --------------- call the signInWithPopup function
      const userCredential = await signInWithPopup(auth, provider);

      // get the Token from the userCredential
      const findedToken = await userCredential.user.getIdToken();

      // --------------- call the backend function to save the data on Mongo DB
      if (userCredential.user && findedToken) {
        const backendResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/login-google`,
          userCredential,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: findedToken,
            },
          }
        );
        // get the user data from the backend response
        const userDataMONGO = await backendResponse.data.user;
        console.log("user data from the backend: ", userDataMONGO);
        return { userDataMONGO, findedToken, userCredential };
      } else {
        // Handle error message
        console.log("Login with Google failed");
      }

      // const userCredential = await signInWithRedirect(auth, provider);
      // we don't need to handle the userCredential here, as it will be handled in the onAuthStateChanged listener
    } catch (error) {
      console.log("Google sign in error:", error);
      return error.message;
    }
  };

  // -------------------------------------------------------------------------------------------------------------

  // Email/Password registration
  const registerWithEmailAndPassword = async (
    email,
    password,
    firstName,
    lastName
  ) => {
    try {
      // ------------------------------------------------------------------------------------------------------------------------
      //call the createUserWithEmailAndPassword function
      const userCredential = await createUserWithEmailAndPassword(
        auth, // the first parameter requires a reference to the service the fuunction is operating on (here auth)
        email,
        password
      );

      // ------------------------------------------------------------------------------------------------------------------------
      // update the displayName and photoURL in firebase before saving the user in the database (backend)
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
        photoURL:
          "https://ui-avatars.com/api/?name=" + firstName + "+" + lastName,
      });

      // Get the token from the response
      const findedToken = await userCredential.user.getIdToken();
      console.log("token:", findedToken);

      // ------------------------------------------------------------------------------------------------------------------------
      //call the backend to register the user with token and the form data from the form
      if (userCredential && findedToken) {
        const backendResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/register`,
          userCredential,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: findedToken,
            },
          }
        );
        // get the user data from the backend response
        const userDataMONGO = await backendResponse.data.user;
        console.log("User data from backend:", userDataMONGO);
        return { userCredential, findedToken, userCredential };
      } else {
        console.log("Registration faild");
      }
    } catch (error) {
      console.log("Registration error:", error);
      return error.message;
    }
  };

  // -------------------------------------------------------------------------------------------------------------

  // Email/Password login
  const emailAndPasswordSingIn = async (email, password) => {
    try {
      // ----------------- call the signInWithEmailAndPassword function
      const userCredential = await signInWithEmailAndPassword(
        auth, // the first parameter requires a reference to the service the fuunction is operating on (here auth)
        email,
        password
      );

      // return the response from the signInWithEmailAndPassword function
      return userCredential.user;
    } catch (error) {
      console.log("Login error:", error);
      return error.message;
    }
  };

  // -------------------------------------------------------------------------------------------------------------

  // Logout
  const logOut = async () => {
    try {
      // call the signOut function
      await signOut(auth);
    } catch (error) {
      console.log("Logout error:", error);
      return error.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        registerWithEmailAndPassword,
        emailAndPasswordSingIn,
        logOut,
        setUser,
        setMongoUser,
        user,
        loading,
        token,
        mongoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
