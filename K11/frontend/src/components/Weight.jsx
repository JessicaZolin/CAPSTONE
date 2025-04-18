import { Form, Alert, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserAuth } from "../context/AuthContext";
import { ButtonComponent } from "./Buttons";
import Loading from "./Loading";

const Weight = () => {
  const [formData, setFormData] = useState({
    weight: {
      value: "",
      unit: "kg",
    },
    date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const navigate = useNavigate();
  const { mongoUser, token } = UserAuth();
  const { exerciseId } = useParams();

  // ---------------------------- Function to get exercises log of the user ----------------------------

  const fetchSingleExerciseLog = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/exerciselogs/exercise/${exerciseId}/${mongoUser._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setExerciseLogs(response.data);
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while fetching the exercise log.");
    }
  };

  useEffect(() => {
    fetchSingleExerciseLog();
  }, [exerciseId, mongoUser._id]);

  // ---------------------------- Function to handle form submission ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = {
      user: mongoUser._id,
      weight: {
        value: formData.weight.value,
        unit: "kg",
      },
      date: formData.date,
      notes: formData.notes,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/exerciselogs/exercise/${exerciseId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      setExerciseLogs((prevLogs) => [response.data, ...prevLogs]);
      setFormData({
        weight: {
          value: "",
          unit: "kg",
        },
        date: "",
        notes: "",
      });
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------- Function to handle exercise log deletion ----------------------------
  const handleDelete = async (logId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/exerciselogs/exercise/${exerciseId}/${logId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchSingleExerciseLog();
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while deleting the exercise log.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container border border-1 rounded-3 shadow-sm p-4">
      <h4 className="mb-4">Your Progress</h4>

      {/* ---------------------------- Show exercise log ---------------------------- */}
      <div className="exercise-log">
        {exerciseLogs.length === 0 ? (
          <p className="text-muted">No exercise log found.</p>
        ) : (
          <>
            <ListGroup className="mt-4">
              {exerciseLogs.map((exerciseLog) => (
                <ListGroup.Item
                  key={exerciseLog._id}
                  className="d-flex justify-content-between align-items-center bg-transparent shadow-sm flex-wrap"
                >
                  <div className=" d-flex col col-md-3">
                    {exerciseLog.date
                      ? new Date(exerciseLog.date).toLocaleDateString()
                      : "No date provided"}
                  </div>
                  <div className="fw-bold col col-md-2">
                    {exerciseLog.weight.value} kg
                  </div>
                  <div className="text-muted col-12 col-md-6 me-2 mt-2 mt-md-0 d-flex align-items-center justify-content-between">
                    <div>{exerciseLog.notes}</div>
                    <ButtonComponent
                      text={"Delete"}
                      onClick={() => handleDelete(exerciseLog._id)}
                      className={"mt-3 mt-md-0"}
                    />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </div>

      <Form onSubmit={handleSubmit} className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3">
          {/* ---------------------------- Weight Date ---------------------------- */}
          <Form.Group controlId="date" className="col">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </Form.Group>

          {/* ---------------------------- Weight input ---------------------------- */}
          <Form.Group controlId="weight" className="col">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter your weight"
              value={formData.weight.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: { ...formData.weight, value: e.target.value },
                })
              }
            />
          </Form.Group>

          {/* ---------------------------- Notes input ---------------------------- */}
          <Form.Group controlId="notes" className="col-6">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </Form.Group>
        </div>
        <ButtonComponent text={"Add new log"} type={"submit"} />
      </Form>
    </div>
  );
};

export default Weight;
