import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { registerWithEmailAndPassword } = UserAuth();

  // Initialize the state for form data and error, useNavigate hook to navigate to different pages
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

  // ---------------------------- Function to handle profile image change ----------------------------
/*   const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
 */
  // ---------------------------- Function to handle form submission ----------------------------
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the function to register the user with email and password in Firebase passing the email, password, first name, and last name from the form data
      const response = await registerWithEmailAndPassword(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      );
      console.log("Response from registerWithEmailAndPassword:", response);

      // Check if the response is a Firebase error and show the error message
      if (typeof response === "string") {
        setError(response);
        return;
      }

      // after successful registration and saving the user in the database, redirect to the homepage
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
      setError(error.message);
    }
  };

  // ---------------------------- Function to handle form input changes ----------------------------
  const handleChangeForm = (e) => {
    // Set the form data state with the input name and value
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------- Render the registration form ----------------------------
  return (
    <Container className="background-card container-main p-4 my-5 rounded shadow ">
      <Button
        type="submit"
        as={Link}
        to="/welcome"
        className="align-self-start mb-3 mb-md-0"
      >
        {" "}
        Back to Welcomepage{" "}
      </Button>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <h2 className="title">Register</h2>

          {/* -------------------------- Error message and success message --------------------------*/}
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && (
            <Alert variant="success">
              Registration successful!...you will be redirected to the Homepage
            </Alert>
          )}

          <Form onSubmit={onSubmit}>
            {/* -------------------------- Input fiel for first name -------------------------- */}
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChangeForm}
                required
              />
            </Form.Group>

            {/* -------------------------- Input field for last name -------------------------- */}
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChangeForm}
                required
              />
            </Form.Group>

            {/* -------------------------- Input field for profile image -------------------------- */}
           {/*  <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Profile image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                placeholder="Upload your profile image"
                onChange={handleImageChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2"
                  style={{
                    maxWidth: "200px",
                    display: "block",
                    marginBottom: "1rem",
                    boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                    borderRadius: "10px",
                  }}
                />
              )}
            </Form.Group> */}

            {/* -------------------------- Input field for email -------------------------- */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChangeForm}
                required
              />
            </Form.Group>

            {/* -------------------------- Input field for password -------------------------- */}
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChangeForm}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              size="lg"
              className="w-100 color-button-546a76"
            >
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
