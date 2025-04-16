import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import ExerciseCard from "../components/ExerciseCard";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// -----------------------------------------------------------------------------------------------

const AdminHome = () => {
  const [exercises, setExercises] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch exercises from the backend
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

 // -----------------------------------------------------------------------------------------------

  return (
    <>
      <Container className="d-flex flex-column flex-md-row gap-5">
        {/* EXERCISES */}
        <Col className="d-flex justify-content-between align-items-center">
          <Row style={{ height: "100%" }} className="d-flex align-items-center">
            <h3 className="mb-3">Exercises</h3>
            {exercisesLoading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {error && <p className="text-danger">{error}</p>}
            {!exercisesLoading &&
              exercises.map((exercise) => (
                <Col key={exercise._id} xs={6} lg={4} className="mb-5">
                  <ExerciseCard exercise={exercise} />
                </Col>
              ))}
          </Row>
        </Col>
        {exercises.length === 0 && !exercisesLoading && (
          <Col>
            <p className="text-muted">No exercises available.</p>
          </Col>
        )}

        {/* TRAINING PLANS  */}
        <Col className="d-flex justify-content-between align-self-start">
          <Row style={{ height: "100%" }} className="d-flex align-items-center">
            <h3 className="mb-3">Training Plans</h3>
            {plansLoading && (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {error && <p className="text-danger">{error}</p>}
            {!plansLoading &&
              trainingPlans.map((trainingPlan) => (
                <Col key={trainingPlan._id} xs={12}>
                  <Card
                    className="col shadow mb-3 background-card selected "
                    onClick={() =>
                      navigate(`/trainingplans/${trainingPlan._id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body>
                      <Card.Title className="m-0">
                        {trainingPlan.name}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            {trainingPlans.length === 0 && !plansLoading && (
              <Col>
                <p className="text-muted">No training plans available.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Container>
    </>
  );
};

export default AdminHome;
