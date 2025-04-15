import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const CreateNewTrainingPlan = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const { user, mongoUser, token } = UserAuth();
  const navigate = useNavigate();
  // console.log("mongoUser: ", mongoUser, "user: ", user, "token: ", token);


  // ---------------------------- Function to handle form input changes ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // verify if the user is logged in
      if (!mongoUser || mongoUser.role !== "admin") {
        setError("You must be logged and admin to create a new training plan.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);

      
      // Call the backend to create the training plan
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/trainingplans`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.data) {
        // console.log("Post created:", response.data);
        navigate("/admin-home");
      }
    } catch (error) {
      console.log("Error creating post:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong while creating the post."
      );
    }
  };

  // ---------------------------- Render the form ----------------------------
  return (
    <div className="container">
      <Button
        className="container-main align-items-centercolor-button-546a76-bg-white"
        onClick={() => navigate("/admin-dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-arrow-left mb-1 me-2"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to the Admin Dashboard
      </Button>
      <Container
        className="background-card p-4 mt-5 rounded shadow"
        style={{ marginBottom: "10%" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h2 className="title">Create New Training Plan</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              {/* ---------------------------- Form Name ---------------------------- */}
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Exercise Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Form.Group>

              {/* ---------------------------- Form Description ---------------------------- */}
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Button className="color-button-546a76" type="submit">
                Create Training Plan
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateNewTrainingPlan;
