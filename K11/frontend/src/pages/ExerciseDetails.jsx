import { Container, Row, Col, Button, Alert, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Weight from "../components/Weight";
import axios from "axios";


const ExerciseDetails = () => {
  const [exercise, setExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { mongoUser } = UserAuth();

  // --------------------------- Function to fetch exercise details ---------------------------
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/exercises/${exerciseId}`
        );
        setExercises(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error while fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [exerciseId]);

  // --------------------------- Function to handle exercise deletion ---------------------------
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/exercises/${exerciseId}`
        );
        navigate("/"); // Aggiorna la lista dei post dopo la cancellazione
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Error while deleting post");
      }
    }
  };

  // --------------------------- verify if the user is admin

  const isAdmin = mongoUser && mongoUser.role === "admin";

  // --------------------------- Render the page ---------------------------
  return (
    <div className="container">
      <Button
        className="container-main align-items-center color-button-546a76-bg-white"
        onClick={() => navigate("/")}
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

      <Button
        className="container-main align-items-center color-button-546a76-bg-white mt-2 mt-sm-0 ms-sm-3"
        onClick={() => navigate("/my-exercises")}
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
        Back to My Exercises
      </Button>


      <Container
        className="background-card p-4 mt-5 rounded shadow"
        style={{ marginBottom: "100px" }}
      >
        {loading && <p>Loading...</p>}
        {error && <Alert variant="danger">{error}</Alert>}
        {exercise && exercise._id && (
          <>
            <Row className="mb-4">
              <Col xs={12} md={8} style={{ minHeight: "300px" }}>
                <div
                  className="d-flex align-items-center pb-3 mb-2 gap-4"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                 {/*  <Badge className="background-badge-category me-2 p-2">
                    {post.category}
                  </Badge> */}
                  <small className="text-muted">
                    {new Date(exercise.createdAt).toLocaleString().split(",")[0]}
                  </small>
                </div>
                <div
                  className="d-flex justify-content-between align-items-start" /* style={{ height: '30%' }} */
                >
                  <h1 className="col-8">{exercise.name}</h1>

                  {/* --------------------------- verify if the user is the author of the post and show the edit and delete buttons */}
                  {isAdmin && (
                    <div className="mt-2">
                      <Button
                        className="me-2 color-button-546a76"
                        onClick={() => navigate(`/exercises/edit/${exercise._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="color-button-delete mt-lg-0 mt-2 mt-sm-0"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                <p style={{ minHeight: "50%" }}>{exercise.description}</p>

              </Col>
              <Col xs={12} md={4} className="d-flex justify-content-center">
                <img
                  src={exercise.cover}
                  alt={exercise.title}
                  className="img-fluid rounded shadow object-fit-cover"
                  style={{ maxHeight: "300px", marginTop: "60px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={8}>
                <Weight id={exercise._id} />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default ExerciseDetails;
