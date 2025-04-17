import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner, Alert } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { ButtonComponent } from "../components/Buttons";

///// AGGIUNGI FORM PER AGGIUNGERE DATA SCADENZA ABO E CERTIFICATO MEDICO

const AdminManageUserProfile = () => {
  const { token } = UserAuth();
  const { userId } = useParams(); // Get the userId from the URL parameters
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    MedicalCertificate: "",
    AboExpiration: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // function to get the user details from the backend
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          MedicalCertificate: response.data.MedicalCertificate
            ? response.data.MedicalCertificate.split("T")[0]
            : "",
          AboExpiration: response.data.AboExpiration
            ? response.data.AboExpiration.split("T")[0]
            : "",
        });
        setError("");
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(
          error?.response?.data?.message || "Error while fetching user details"
        );
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, [userId]);

  // ---------------------------- Function to handle form input changes ----------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------- Function to handle profile update ----------------------------
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Create a FormData object and append form data
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append(
        "MedicalCertificate",
        formData.MedicalCertificate || ""
      );
      formDataToSend.append("AboExpiration", formData.AboExpiration || "");

      // Better FormData logging
      /* for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].type})`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      } */

      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setSuccess("Profile updated successfully.");
      setError("");
      setTimeout(() => navigate("/userslist"), 2000); // Redirect to the users page after successful update
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong while updating profile."
      );
      // console.log(error);
      setSuccess("");
    }
  };

  // ---------------------------- Function to handle form submit ----------------------------

  /* const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/me`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccess("Profile deleted successfully.");
      setError("");
      setPreviewUrl("");
      setProfileImage(null);
      setMongoUser(null);
      setUser(null);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong while deleting profile."
      );
      // console.log(error);
      setSuccess("");
    } finally {
      return navigate("/welcome");
    }
  }; */

  // -------------------------- render the profile page --------------------------
  return (
    <div className="container">
      <ButtonComponent text={"Userslist"} as={Link} to={"/userslist"} />

      <Container
        className="p-4 my-5 rounded shadow"
      >
        <Row className="justify-content-center">
          <Col md={6}>
            {/* -------------------------- manage profile -------------------------- */}
            <div className="d-flex justify-content-between">
              <h2 className="title">Manage User Profile</h2>
              {/*  <Button
                type="submit"
                variant="danger"
                onClick={handleDeleteProfile}
              >
                Delete Profile
              </Button> */}
            </div>

            {loading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleProfileUpdate}>
              {/* -------------------------- Input field for FIRSTNAME -------------------------- */}
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* -------------------------- Input field for LASTNAME -------------------------- */}
              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* -------------------------- Input field for EMAIL -------------------------- */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </Form.Group>

              {/* -------------------------- Input field for MEDICALCERTIFICATE -------------------------- */}
              <h4 className="mt-5 title">
                Add medical certificate expiration date
              </h4>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Date of expiration</Form.Label>
                <Form.Control
                  type="date"
                  name="MedicalCertificate"
                  value={formData.MedicalCertificate || null}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* -------------------------- Input field for ABONEMENT -------------------------- */}
              <h4 className="mt-5 title">Add abonement expiration date</h4>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Date of expiration</Form.Label>
                <Form.Control
                  type="date"
                  name="AboExpiration"
                  value={formData.AboExpiration || null}
                  onChange={handleChange}
                />
              </Form.Group>

              <ButtonComponent
                text={"Update Profile"}
                type={"submit"}
                className={"w-100"}
              />
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminManageUserProfile;
