import { Card, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { ButtonComponent } from "../components/Buttons";

function AdminSeeUserExercises() {
  const { userId } = useParams();
  const { token } = UserAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/exerciselogs/user/${userId}`,
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
      console.error("Error fetching exercises:", error);
      setError("No exercises tracked yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="container">
      <ButtonComponent text={"Userslist"} as={Link} to={"/userslist"} />

      <Container className="mt-5">
        <Row className="mb-3">
          <h4>Here you can see your exercises with their details</h4>
        </Row>

        {loading && (
          <Spinner animation="border" className="mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {error && <p className="text-danger">{error}</p>}
        <Row className="d-flex align-items-center">
          {!loading &&
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
            ))}
        </Row>
      </Container>
    </div>
  );
}

export default AdminSeeUserExercises;
