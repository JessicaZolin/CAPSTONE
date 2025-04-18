import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import { ButtonComponent } from "../components/Buttons";

const CreateNewTrainingPlan = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");
  const { user, mongoUser, token } = UserAuth();
  const navigate = useNavigate();


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
      <ButtonComponent text={"Admin Dashboard"} as={Link} to={"/admin-dashboard"} />
      
      <Container
        className="p-4 my-5 rounded shadow"
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
              <ButtonComponent text={"Create Training Plan"} type={"submit"} />
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateNewTrainingPlan;
