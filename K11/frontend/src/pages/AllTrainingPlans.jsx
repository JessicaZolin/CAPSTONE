import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ButtonComponent } from "../components/Buttons";

const AllTrainingPlans = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, mongoUser } = UserAuth();

  useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchTrainingPlans();
  }, []);

  return (
    <div className="container">
      <ButtonComponent text={mongoUser.role === "admin" ? "Admin Dashboard" : "User Dashboard"} as={Link} to={mongoUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard"} />

      <Container className="d-flex flex-column gap-2 mt-4">
        <Row style={{ height: "100%" }} className="d-flex align-items-center">
          <h3 className="mb-3">Training Plans</h3>
          {loading && (
            <Spinner animation="border" role="status" className="m-auto">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {error && <p className="text-danger">{error}</p>}
          {!loading && (
            trainingPlans.map((trainingPlan) => (
              <Col key={trainingPlan._id} xs={12} md={8} >
                <Card
                  className="col shadow mb-3 background-card selected "
                  onClick={() => navigate(`/trainingplans/${trainingPlan._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title className="m-0">{trainingPlan.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
          {trainingPlans.length === 0 && !loading && (
            <Col>
              <p>No training plans found.</p>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default AllTrainingPlans;
