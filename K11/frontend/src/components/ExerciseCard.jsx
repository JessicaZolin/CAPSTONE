import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();

  return (
    <>
    <Card xs={12} md={6} lg={4}
      className="mb-3 border shadow"
      onClick={() => navigate(`/exercises/${exercise._id}`)}
      style={{ cursor: "pointer", height: "280px"}}
    >
      <Card.Img
        variant="top"
        src={exercise.cover}
        style={{ minHeight: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{exercise.name}</Card.Title>
      </Card.Body>
    </Card>
    </>
  );
};

export default ExerciseCard;
