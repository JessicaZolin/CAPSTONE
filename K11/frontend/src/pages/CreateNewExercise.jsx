import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import { ButtonComponent } from "../components/Buttons";


const CreateNewExercise = () => {
  const [formData, setFormData] = useState({
    name: "",
    cover: "",
    description: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const { user, mongoUser, token } = UserAuth();
  const navigate = useNavigate();
  // console.log("mongoUser: ", mongoUser, "user: ", user, "token: ", token);

  // ---------------------------- Function to handle cover image change ----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ---------------------------- Function to handle form input changes ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // verify if the user is logged in
      if (!mongoUser || mongoUser.role !== "admin") {
        setError("You must be logged and admin to create a new exercise.");
        return;
      }

      if (!coverImage) {
        setError("Please select a cover image.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("cover", coverImage);
      formDataToSend.append("description", formData.description);

      // Call the backend to create the exercise
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/exercises`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
      <ButtonComponent text={"AdminDashboard"} as={Link} to={"/admin-dashboard"} />
      
      <Container
        className="p-4 my-5 rounded shadow"
      >
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h2 className="title">Create New Exercises</h2>
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

              {/*  ---------------------------- Form Cover ---------------------------- */}
              <Form.Group className="mb-3" controlId="cover">
                <Form.Label>Cover Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  placeholder="Enter cover"
                  onChange={handleImageChange}
                  required
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
              <ButtonComponent text={"Create Exercise"} type={"submit"} />
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateNewExercise;
