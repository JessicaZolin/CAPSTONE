import { useState, useEffect } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { ButtonComponent } from "../components/Buttons";
import Loading from "../components/Loading";

const AllExerciseWithLogs = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = UserAuth();

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

  if (loading) {
    return (
      <Loading /> 
    )
  }

  return (
    <div className="container">
      <ButtonComponent
        text={"Admin Dashboard"}
        as={Link}
        to={"/admin-dashboard"}
      />

      <Container>
        <Row className="d-flex align-items-center mt-4">
          <h3 className="mb-3">All Exercises</h3>
          {error ? (
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
