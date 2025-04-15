import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";
import { useNavigate } from "react-router-dom";

const AllExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();
  const navigate = useNavigate();
  console.log(token);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/exercises`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response.data);
        setExercises(response.data.exercises);
        setError(null);
      } catch (error) {
        console.log("Error fetching exercises:", error);
        setError(error.message);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  return (
    <div className="container">
      <Button
        className="container-main align-items-center color-button-546a76-bg-white mb-5"
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

      <Container className="d-flex flex-column gap-2">
        <Row style={{ height: "100%" }} className="d-flex align-items-center">
          <h3 className="mb-3">Exercises</h3>
          {loading && (
            <Spinner animation="border" role="status" className="m-auto">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {error && <p className="text-danger">{error}</p>}
          {!loading &&
            exercises.map((exercise) => (
              <Col key={exercise._id} xs={6} md={2} className="mb-5">
                <ExerciseCard exercise={exercise} />
              </Col>
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default AllExercise;
