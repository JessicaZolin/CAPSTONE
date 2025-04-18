import { Container, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { ButtonComponent } from "../components/Buttons";
import Loading from "../components/Loading";

const TrainingPlansDetails = () => {
  const [trainingPlans, setTrainingPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { trainingPlanId } = useParams();
  const navigate = useNavigate();
  const { mongoUser, token } = UserAuth();

  // --------------------------- Function to fetch exercise details ---------------------------
  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/trainingplans/${trainingPlanId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setTrainingPlans(response.data.trainingPlan);
        setError(null);
      } catch (error) {
        console.error("Error fetching training plans:", error);
        setError("Error while fetching training plans");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlans();
  }, [trainingPlanId]);

  // --------------------------- Function to handle exercise deletion ---------------------------
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this training plan?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/trainingplans/${trainingPlanId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        navigate("/admin-home"); // Aggiorna la lista dei post dopo la cancellazione
      } catch (error) {
        console.error("Error deleting post:", error);
        setError("Error while deleting post");
      }
    }
  };

  // --------------------------- verify if the user is admin

  const isAdmin = mongoUser && mongoUser.role === "admin";

  if (loading) {
    return <Loading />;
  }

  // --------------------------- Render the page ---------------------------
  return (
    <div className="container">
      <ButtonComponent text={"All Training Plans"} as={Link} to="/all-trainingplans" />
      <ButtonComponent
        text={"Homepage"}
        as={Link}
        to={mongoUser.role === "admin" ? "/admin-home" : "/"}
      />

      <Container className="p-4 my-5 rounded shadow">
        {error && <Alert variant="danger">{error}</Alert>}
        {trainingPlans && (
          <>
            <Row className="mb-4">
              <Col xs={12} md={8} style={{ minHeight: "300px" }}>
                <div
                  className="d-flex align-items-center pb-3 mb-2 gap-4"
                  style={{ borderBottom: "1px solid #ccc" }}
                >
                  <small className="text-muted">
                    {
                      new Date(trainingPlans.createdAt)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </small>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h1 className="col-7 col-md mb-4">{trainingPlans.name}</h1>

                  {/* --------------------------- verify if the user is the author of the post and show the edit and delete buttons */}
                  {isAdmin && (
                    <div>
                      <ButtonComponent
                        text={"Edit"}
                        as={Link}
                        to={`/trainingplans/edit/${trainingPlans._id}`}
                      />
                      <ButtonComponent text={"Delete"} onClick={handleDelete} />
                    </div>
                  )}
                </div>
                <p style={{ minHeight: "50%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{trainingPlans.description}</p>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default TrainingPlansDetails;
