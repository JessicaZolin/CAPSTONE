import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig.js";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { getRedirectResult, sendPasswordResetEmail } from "firebase/auth";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { googleSignIn, emailAndPasswordSingIn, user, token } = UserAuth();

  // -------------------------------------------------------- Handle form login with email and password
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the function to login the user with email and password in Firebase passing the email and password from the form data
      const response = await emailAndPasswordSingIn(email, password);

      if (response && typeof response === "object" && response.uid) {
        // After successful login, redirect to the home page
        navigate("/");
      } else {
        // Handle error message
        setError(typeof response === "string" ? response : "Login failed");
      }
    } catch (error) {
      console.log(error);
      setError(error.message || "An error occurred during login");
    }
  };

  // -------------------------------------------------------- Handle sign in with google
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      // Call the function to login the user with Google in Firebase
      const response = await googleSignIn();

      console.log ("Response from googleSignIn:", response);

      // Get the token from the response
      // const token = await response.getIdToken();

      // If the response and token are available, call the backend to register the user with the token and the data from the response
      /* if (response) {
        const backendResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/login-google`,
          response.user,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: response.token,
            },
          }
        );
        // get the user data from the backend response
        const userData = await backendResponse.data.user;
        console.log("user data: ", userData); 
        
        setIsLoading(false); // Set loading state to false
      } else {
        // Handle error message
        setError("Login with Google failed");
      } */
    } catch (error) {
      console.log(error);
      setError(error.message || "An error occurred during login with Google");
    }
  };

  // -------------------------------------------------------- Handle redirect result from Google sign-in

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user]);

  const handlePasswordReset = () => {
    // Implement password reset functionality here
    const email = prompt("Please enter your email address for password reset:");
    if (email) {
      sendPasswordResetEmail(auth, email);
      alert(
        "Password reset email sent! Please check your inbox for password reset instruction."
      );
    } else {
      alert("Please enter a valid email address.");
    }
  };

  // ---------------------------- Render the login form ----------------------------
  return (
    <>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Container className="background-card container-main p-4 my-5 rounded shadow pages">
          <Button
            type="submit"
            as={Link}
            to="/"
            className="align-self-start mb-3 mb-md-0"
          >
            {" "}
            Back to Welcomepage{" "}
          </Button>
          {/* {userLoggingIn && <Navigate to="/" replace={true} />} */}
          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <h2 className="title">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSubmit}>
                {/* ---------------------------- Email input ---------------------------- */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                {/* ---------------------------- Password input ---------------------------- */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                {/* ---------------------------- Login button ---------------------------- */}
                <div className="d-grid gap-2 mb-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="py-2 color-button-546a76"
                  >
                    Login
                  </Button>
                </div>
                <div className="text-muted text-center mb-3">Or</div>

                {/* ---------------------------- Google login button ---------------------------- */}
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleGoogleSignIn}
                    className="d-flex align-items-center justify-content-center py-2 gap-2 color-button-google"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="16"
                      height="16"
                      viewBox="0 0 50 50"
                    >
                      <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
                    </svg>
                    Login with Google
                  </Button>
                  {/* <GoogleButton
                    type="dark"
                    className="d-flex align-items-center justify-content-center py-2 gap-2 color-button-google"
                    onClick={onGoogleSignIn}
                  /> */}
                </div>
                <p
                  className="mt-4 bg-transparent"
                  style={{ fontSize: "0.9rem", border: "none" }}
                >
                  Don't have an account?{"  "}
                  <Alert.Link href="/register">Register</Alert.Link>
                </p>
                <p
                  className="bg-transparent"
                  style={{
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handlePasswordReset}
                >
                  Forgot your password?{"  "}
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Login;
