import { Card, Container, Row } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { ButtonComponent } from "../components/Buttons";
import Loading from "../components/Loading";

function MyExercise() {
  const { mongoUser, token } = UserAuth();
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
      setExercises(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError("Error while fetching exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="container">
      <ButtonComponent text={mongoUser.role === "admin" ? "Admin Dashboard" : "User Dashboard"} as={Link} to={mongoUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}/>

      <Container className="mt-5">
        <Row className="mb-3">
          <h4>Here you can see your exercises with their details</h4>
        </Row>
        
        {error && <p className="text-danger">{error}</p>}
        <Row className="d-flex align-items-center">
          {!loading &&
            exercises.map((exercise) => (
              <Card
                className="shadow mb-3"
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
          {/* {exercises.length === 0 && !loading && <p>You have no tracked exercises yet</p>} */}
        </Row>
      </Container>
    </div>
  );
}

export default MyExercise;
