import { Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();

  return (
    <Card xs={12} md={6} lg={4}
      className="shadow mb-3 border border-dark background-card"
      onClick={() => navigate(`/exercises/${exercise._id}`)}
      style={{ cursor: "pointer", height: "27 0px"}}
    >
      <Card.Img
        variant="top"
        src={exercise.cover}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        {/* <div className="d-flex justify-content-between mb-4">
          <Badge className="background-badge-category">{post.category}</Badge>
          <small className="text-muted">
            {post.readTime.value} {post.readTime.unit}
          </small>
        </div> */}
        <Card.Title /* style={{ height: "30%" }} */>{exercise.name}</Card.Title>
        {/* <Card.Text style={{ height: "40%" }}>
          {exercise.description.substring(0, 100)}...
        </Card.Text> */}
        {/* <Badge
          bg="dark"
          className="mb-3 background-badge-category d-flex align-items-center justify-content-center"
          style={{ height: "38px" }}
        >
          {post.author ? userFirstName + " " + userLastName : "Unknown"}{" "}
          {post.author && post.author.profileImage && (
            <img
              src={post.author?.profileImage}
              className="rounded-circle"
              alt="profile image"
              style={{
                width: "20px",
                height: "20px",
                margin: "5px",
                objectFit: "cover",
              }}
            />
          )}
        </Badge> */}
      </Card.Body>
    </Card>
  );
};

export default ExerciseCard;
