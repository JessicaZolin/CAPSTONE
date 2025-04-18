import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig.js";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { getRedirectResult, sendPasswordResetEmail } from "firebase/auth";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { ButtonComponent } from "../components/Buttons.jsx";
import Loading from "../components/Loading.jsx";

// -----------------------------------------------------------------------------------------------

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { googleSignIn, emailAndPasswordSingIn, user, mongoUser, token } =
    UserAuth();

  // -------------------------------------------------------- Handle form login with email and password
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the function to login the user with email and password in Firebase passing the email and password from the form data
      const response = await emailAndPasswordSingIn(email, password);

      if (response && typeof response === "object" && response.uid) {
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
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // -------------------------------------------------------- Handle redirect result from Google sign-in

  useEffect(() => {
    const handleNavigation = () => {
      // Check if both Firebase and MongoDB user are loaded
      if (user && mongoUser) {
        // Check user role and navigate accordingly
        if (mongoUser.role === "admin") {
          navigate("/admin-home");
        } else {
          navigate("/");
        }
      } else if (!user) {
        // Only navigate to login if there's no user
        // This prevents infinite redirect loops
        navigate("/login");
      }
      // Don't navigate if we're still waiting for mongoUser
    };

    handleNavigation();
  }, [user, mongoUser, navigate]); // Add mongoUser to dependencies

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

  if (isLoading) {
    return <Loading />;
  }

  // -----------------------------------------------------------------------------------------------

  return (
    <>
      <div className="container">
        <ButtonComponent
          text={"Welcomepage"}
          type={"submit"}
          as={Link}
          to={"/welcome"}
        />

        <Container className="p-4 my-5 rounded shadow">
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
                  <ButtonComponent text={"Login"} type={"submit"} size={"lg"} />
                </div>
                <div className="text-muted text-center mb-3">Or</div>

                {/* ---------------------------- Google login button ---------------------------- */}
                <div className="d-grid gap-2">
                  <ButtonComponent
                    text={"Sign in with Google"}
                    onClick={handleGoogleSignIn}
                    className={
                      "d-flex align-items-center justify-content-center gap-2"
                    }
                    svg={
                      <svg width="30" height="30" role="img">
                        <title>Google's Logo</title>
                        <g
                          id="Google-Button"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <rect
                            x="0"
                            y="0"
                            width="30"
                            height="30"
                            rx="2"
                          ></rect>
                          <g
                            id="logo_googleg_48dp"
                            transform="translate(1.65, 1.65) scale(1.4300000000000002)"
                          >
                            <path
                              d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                              id="Shape"
                              fill="#4285F4"
                            ></path>
                            <path
                              d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                              id="Shape"
                              fill="#34A853"
                            ></path>
                            <path
                              d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                              id="Shape"
                              fill="#FBBC05"
                            ></path>
                            <path
                              d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                              id="Shape"
                              fill="#EA4335"
                            ></path>
                            <path
                              d="M0,0 L18,0 L18,18 L0,18 L0,0 Z"
                              id="Shape"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    }
                  />
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
      </div>
    </>
  );
};

export default Login;
