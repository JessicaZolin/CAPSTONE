import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { ButtonComponent } from "../components/Buttons";
import Loading from "../components/Loading";

const EditTrainingPlan = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { trainingPlanId } = useParams();
  const navigate = useNavigate();
  const { user, mongoUser, token } = UserAuth();

  // --------------------------- Function to handle post input changes ----------------------------
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
        const trainingPlan = response.data.trainingPlan;
        console.log(trainingPlan);
        console.log(trainingPlan.name);

        setFormData({
          name: trainingPlan.name,
          description: trainingPlan.description,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Error while fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlans();
  }, [trainingPlanId, navigate]);

 
  // ---------------------------- Function to handle form submit ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // verify if the user is logged in and is admin
      if (!mongoUser || mongoUser.role !== "admin") {
        setError("You must be logged and admin to edit an exercise.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);

      // 🔍 Verifica contenuto FormData
      /* for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      } */
      
        const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/trainingplans/${trainingPlanId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (response.data) {
          navigate(`/trainingplans/${trainingPlanId}`);
        }
    } catch (error) {
      console.error("Error updating exercise:", error);
      setError(
        error.response?.data?.message || "Error while updating exercise"
      );
    }
  };

  if (loading)
    return (
      <Loading />
    );

  // --------------------------- Render the form ----------------------------
  return (
    <div className="container">
      <ButtonComponent text={"Back"} as={Link} to={`/trainingplans/${trainingPlanId}`} />

    <Container
      className="p-4 my-5 rounded shadow"
    >
      <Row className="justify-content-center ">
        <Col xs={12} md={6}>
          <h2 className="title">Edit Exercise</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>

            {/*                        ---------------------------- Form Field Title ---------------------------- */}
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Exercise Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            {/*                        ---------------------------- Form Field Description ---------------------------- */}
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <ButtonComponent text={"Update Exercise"} type={"submit"} />

          </Form>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default EditTrainingPlan;
