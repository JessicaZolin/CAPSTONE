import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllTrainingPlans = () => {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/trainingplans`
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
      <Button
        className="container-main align-items-center color-button-546a76-bg-white mb-5"
        onClick={() => navigate("/user-dashboard")}
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
        Back to the User Dashboard
      </Button>

      <Container className="d-flex flex-column gap-2">
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
              <Col key={trainingPlan._id} xs={12} md={8} className="mb-5">
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
