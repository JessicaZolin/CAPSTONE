import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  console.log(user);

  return (
    <Card xs={12} md={6} lg={4}
      className="shadow mb-3 border border-dark background-card"
      style={{ cursor: "pointer", height: "500px"}}
    >
      <Card.Img
        variant="top"
        src={user.profileImage}
        style={{ height: "150px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{user.firstName} {user.lastName}</Card.Title>
        <Card.Text className="d-flex flex-column gap-2">
          <strong>Email:</strong> {user.email}
          <strong>Certificato medico:</strong> {user.MedicalCertificate ? new Date(user.MedicalCertificate).toLocaleDateString() : "No"}
          <strong>Scadenza Abo:</strong> {user.AboExpiration ? new Date(user.AboExpiration).toLocaleDateString() : "No subscription"}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between gap-2 mb-1">
        <Button className="color-button-546a76-bg-white" onClick={() => navigate(`/Admin-manage-user-profile/${user._id}`)} >Update</Button>
        <Button className="color-button-546a76-bg-white">Add Training </Button>
        <Button className="color-button-546a76-bg-white" onClick={() => navigate(`/user-exercises/${user._id}`)}>View Exercise</Button>
      </Card.Footer>
    </Card>
  );
};

export default UserCard;
