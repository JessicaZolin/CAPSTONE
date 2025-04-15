import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const [exercises, setExercises] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();
  const navigate = useNavigate();
  console.log("token", token);

  useEffect(() => {
    // Fetch exercises from the backend
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/exercises`
        );
        console.log("Exercises response:", response.data);
        setExercises(response.data.exercises);
        setError(null);
      } catch (error) {
        console.log("Error fetching exercises:", error);
        setError(error.message);
        setExercises([]);
      } finally {
        setExercisesLoading(false);
      }
    };

    // fetch training plans from the backend
    const fetchTrainingPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/trainingplans`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Training plans response:", response.data);
        setTrainingPlans(response.data.trainingPlans);
        setError(null);
      } catch (error) {
        console.log("Error fetching training plans:", error);
        setError(error.message);
        setTrainingPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchExercises();
    fetchTrainingPlans();
  }, []);

  return (
    <>
      <Container className="d-flex flex-column flex-md-row gap-5">
        <Col className="d-flex justify-content-between align-items-center">
          {exercisesLoading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row style={{ height: "100%" }} className="d-flex align-items-center">
            <h3 className="mb-3">Exercises</h3>
            {!exercisesLoading ? (
              exercises.map((exercise) => (
                <Col key={exercise._id} xs={6} lg={4} className="mb-5">
                  <ExerciseCard exercise={exercise} />
                </Col>
              ))
            ) : (
              <Col>
                <p>No exercises found.</p>
              </Col>
            )}
          </Row>
        </Col>
        <Col className="d-flex justify-content-between align-self-start">
          {plansLoading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          <Row style={{ height: "100%" }} className="d-flex align-items-center">
            <h3 className="mb-3">Training Plans</h3>
            {console.log(trainingPlans)}
            {!plansLoading ? (
              trainingPlans.map((trainingPlan) => (
                <Col key={trainingPlan._id} xs={12}>
                  <Card
                    className="col shadow mb-3 background-card selected "
                    onClick={() => navigate(`/trainingplans/${trainingPlan._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body>
                      <Card.Title className="m-0">
                        {trainingPlan.name}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p>No training plans found.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Container>
    </>
  );
};

export default AdminHome;
