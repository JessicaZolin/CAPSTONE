import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";

const EditExercise = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    cover: "",
    description: "",
  });
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { user, mongoUser, token } = UserAuth();

  // --------------------------- Function to handle post input changes ----------------------------
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/exercises/${exerciseId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const exercise = response.data;
        console.log(exercise.name);

        setFormData({
          name: exercise.name,
          cover: exercise.cover,
          description: exercise.description,
        });
        setPreviewUrl(exercise.cover);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error while fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [exerciseId, navigate]);

  // --------------------------- Function to handle cover image change ----------------------------
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ---------------------------- Function to handle form submit ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // verify if the user is logged in and is admin
      if (!mongoUser || mongoUser.role !== "admin") {
        setError("You must be logged and admin to edit an exercise.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);

      // Append cover image if it exists
      if (coverImage) {
        formDataToSend.append("cover", coverImage);
      }

      // 🔍 Verifica contenuto FormData
      /* for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      } */

        const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/exercises/${exerciseId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: token,
            },
          }
        );

        if (response.data) {
          navigate(`/exercises/${exerciseId}`);
        }
    } catch (error) {
      console.error("Error updating exercise:", error);
      setError(
        error.response?.data?.message || "Error while updating exercise"
      );
    }
  };

  if (loading)
    return (
      <Container className="container-main mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );

  // --------------------------- Render the form ----------------------------
  return (
    <div className="container">
    <Button
      className="container-main align-items-center color-button-546a76-bg-white"
      onClick={() => navigate("/admin-home")}
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
      Back to the Homepage
    </Button>

    <Container
      className="background-card mt-5 p-4 rounded shadow"
      style={{ marginBottom: "100px" }}
    >
      <Row className="justify-content-center ">
        <Col xs={12} md={6}>
          <h2 className="title">Edit Exercise</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>

            {/*                        ---------------------------- Form Field Title ---------------------------- */}
            <Form.Group className="mb-3" controlId="title">
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

            {/*                        ---------------------------- Form Field Cover Image ---------------------------- */}
            <Form.Group className="mb-3" controlId="cover">
              <Form.Label>Cover Image</Form.Label>
              {previewUrl && (
                <div className="mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      display: "block",
                      marginBottom: "1rem",
                      boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
              <Form.Text className="text-muted">
                Upload an image for the cover only if you want to change it.
              </Form.Text>
            </Form.Group>

            {/*                        ---------------------------- Form Field Description ---------------------------- */}
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button className="color-button-post" type="submit">
              Update Exercise
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default EditExercise;
