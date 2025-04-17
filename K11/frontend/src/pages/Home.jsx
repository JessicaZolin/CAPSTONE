import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";
import { UserAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const Home = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();

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

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <Container className="d-flex flex-column gap-2">
        {error && <p className="text-danger">{error}</p>}
        <Row style={{ height: "100%" }} className="d-flex align-items-center">
          <h3 className="mb-3">Exercises</h3>
          {!loading && (
            exercises.map((exercise) => (
              <Col key={exercise._id} xs={6} md={2} className="mb-5">
                <ExerciseCard exercise={exercise} />
              </Col>
            ))
          )}
          {exercises.length === 0 && !loading && (
            <Col>
              <p>No exercises found.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Home;
