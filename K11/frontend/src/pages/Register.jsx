import { useState } from "react";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.jsx";
import { ButtonComponent } from "../components/Buttons.jsx";

// -----------------------------------------------------------------------------------------------

const Register = () => {
  const { registerWithEmailAndPassword } = UserAuth();

  // Initialize the state for form data and error, useNavigate hook to navigate to different pages
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: "",
    MedicalCertificate: "",
    AboExpiration: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

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
        formData.MedicalCertificate,
        formData.AboExpiration
      );
      console.log("Response from registerWithEmailAndPassword:", response);

      // Check if the response is a Firebase error and show the error message
      if (typeof response === "string") {
        setError(response);
        return;
      }
      setSuccessMessage();
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

  // -----------------------------------------------------------------------------------------------

  return (
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
            <h2 className="title">Register</h2>

            {/* -------------------------- Error message and success message --------------------------*/}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">
                Registration successful!...you will be redirected to the
                Homepage
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

              <ButtonComponent
                text={"Register"}
                type={"submit"}
                size={"lg"}
                className={"w-100"}
              />
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
