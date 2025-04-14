import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Accordion,
} from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";


const AllExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();
  console.log(token);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/exerciseslogs/see-all`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(response.data);
        setExercises(response.data);
        setError(null); // Reset the error state
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Error while fetching exercises"); // Set the error state
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchExercises();
  }, []);

  return (
    <Container>
      <Row className="d-flex align-items-center">
        <h3 className="mb-3">All Exercises</h3>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          exercises.map((exercise) => (
            <Col key={exercise._id} xs={12} className="mb-5">
              <Accordion defaultActiveKey={null}>
                <Accordion.Item eventKey={exercise._id}>
                  <Accordion.Header className="d-flex justify-content-between align-items-center gap-5">
                    <span>
                      <h5 className="mb-0 me-2">{exercise.exercise.name}</h5>
                    </span>{" "}
                    <span>( {exercise.userLogs.length} Users )</span>
                  </Accordion.Header>
                  {exercise.userLogs
                    .sort((a, b) => a.lastName.localeCompare(b.lastName))
                    .map((userLog) => (
                      <Accordion.Body key={userLog.userId}>
                        <div className="d-flex justify-content-between align-items-center gap-5">
                          <span className="fw-bold">
                            {userLog.firstName} {userLog.lastName}
                          </span>
                        </div>
                        {
                          <ul className="list-group list-group-flush">
                            {userLog.logs
                              .sort(
                                (a, b) => new Date(b.date) - new Date(a.date)
                              )
                              .map((log) => (
                                <li
                                  key={log.logId}
                                  className="list-group-item d-flex justify-content-between align-items-start gap-2"
                                >
                                  <Col>
                                    {new Date(log.date).toLocaleDateString()}
                                  </Col>
                                  <Col>{log.weight.value} kg </Col>
                                </li>
                              ))}
                          </ul>
                        }
                      </Accordion.Body>
                    ))}
                </Accordion.Item>
              </Accordion>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};
export default AllExercise;
