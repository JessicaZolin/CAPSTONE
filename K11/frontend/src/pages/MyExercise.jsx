import { Card, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

function MyExercise() {
  const { user, mongoUser, token } = UserAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/exerciselogs/user/${mongoUser?._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data);
      setExercises(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Error while fetching post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="container">
      <Button
        className="container-main align-items-center color-button-546a76-bg-white"
        onClick={() => {
          mongoUser?.role === "admin"
            ? navigate("/admin-dashboard")
            : navigate("/user-dashboard");
        }}
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
        {mongoUser?.role === "admin"
          ? "Back to the Admin Dashboard"
          : "Back to the User Dashboard"}
      </Button>

      <Container className="mt-5">
        <Row className="mb-3">
          <h4>Here you can see your exercises with their details</h4>
        </Row>

        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Row className="d-flex align-items-center">
          {!loading &&
            (exercises.length > 0 ? (
              exercises.map((exercise) => (
                <Card
                  className="shadow mb-3 background-card selected"
                  key={exercise._id}
                  onClick={() => navigate(`/exercises/${exercise._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{exercise.exercise.name}</Card.Title>
                    <Card.Text>
                      Last Update:{" "}
                      {new Date(exercise.lastDate).toLocaleDateString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="d-flex justify-content-center my-4">
                <p className="fs-3 text-danger">
                  You don't have any exercise tracked yet.
                </p>
              </p>
            ))}
          {/* <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/exercise/${exercises[0]?._id}`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>{exercises[0]?.exercise.name}</Card.Title>
              <Card.Text>See and modify and track your exercises.</Card.Text>
            </Card.Body>
          </Card> */}
        </Row>
      </Container>
    </div>
  );
}

export default MyExercise;
