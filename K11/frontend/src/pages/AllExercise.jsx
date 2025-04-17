import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";
import { useNavigate, Link } from "react-router-dom";
import { ButtonComponent } from "../components/Buttons";

const AllExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();
  const navigate = useNavigate();

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
      <ButtonComponent text={"Admin Dashboard"} as={Link} to={"/admin-dashboard"} />
    
      <Container className="d-flex flex-column gap-2 mt-4">
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
