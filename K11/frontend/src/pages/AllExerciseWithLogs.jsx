import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Accordion,
  Button,
} from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllExerciseWithLogs = () => {
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
          `${process.env.REACT_APP_BACKEND_URL}/exerciselogs/see-all`,
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

      <Container>
        <Row className="d-flex align-items-center">
          <h3 className="mb-3">All Exercises</h3>
          {loading ? (
            <Spinner animation="border" role="status" className="m-auto">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
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
    </div>
  );
};
export default AllExerciseWithLogs;
