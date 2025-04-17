import { Container, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Weight from "../components/Weight";
import axios from "axios";
import { ButtonComponent } from "../components/Buttons";
import Loading from "../components/Loading";

const ExerciseDetails = () => {
  const [exercise, setExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { mongoUser, token } = UserAuth();

  // --------------------------- Function to fetch exercise details ---------------------------
  useEffect(() => {
    const fetchPost = async () => {
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
          `${process.env.REACT_APP_BACKEND_URL}/exercises/${exerciseId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        {
          mongoUser.role === "admin" ? navigate("/Admin-home") : navigate("/");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Error while deleting post");
      }
    }
  };

  // --------------------------- verify if the user is admin

  const isAdmin = mongoUser && mongoUser.role === "admin";

  if (loading) {
    return (
      <Loading />
    );
  }

  // --------------------------- Render the page ---------------------------
  return (
    <div className="container">
      <ButtonComponent
        text={"Homepage"}
        as={Link}
        to={mongoUser.role === "admin" ? "/Admin-home" : "/"}
      />
      <ButtonComponent text={"My Exercises"} as={Link} to={"/my-exercises"} />

      <Container className="p-4 my-5 rounded shadow ">
        {error && <Alert variant="danger">{error}</Alert>}
        {exercise && exercise._id && (
          <>
            <Row className="mb-4">
              <Col xs={12} md={8}>
                <div
                  className="d-flex align-items-center pb-3 mb-2 gap-4"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <small className="text-muted">
                    {
                      new Date(exercise.createdAt)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </small>
                </div>
                <div className="d-flex justify-content-between align-items-start">
                  <h1 className="col-6 col-md-8">{exercise.name}</h1>

                  {/* --------------------------- verify if the user is the author of the post and show the edit and delete buttons */}
                  {isAdmin && (
                    <div className="mt-2">
                      <ButtonComponent
                        text={"Edit"}
                        as={Link}
                        to={`/exercises/edit/${exercise._id}`}
                      />
                      <ButtonComponent text={"Delete"} onClick={handleDelete} />
                    </div>
                  )}
                </div>
                <p style={{ minHeight: "50%" }}>{exercise.description}</p>
              </Col>
              <Col
                xs={12}
                md={4}
                className="d-flex justify-content-center d-none d-md-flex"
              >
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
