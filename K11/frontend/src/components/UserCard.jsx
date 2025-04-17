import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ButtonComponent } from "./Buttons";

const UserCard = ({ user }) => {

  return (
    <Card
      xs={12}
      md={6}
      lg={4}
      className="border border-dark shadow"
      style={{ cursor: "pointer", height: "500px" }}
    >
      <Card.Img
        variant="top"
        src={user.profileImage}
        style={{ height: "150px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>
          {user.firstName} {user.lastName}
        </Card.Title>
        <Card.Text className="d-flex flex-column gap-2">
          <strong>Email:</strong> {user.email}
          <strong>Certificato medico:</strong>{" "}
          {user.MedicalCertificate
            ? new Date(user.MedicalCertificate).toLocaleDateString()
            : "No"}
          <strong>Scadenza Abo:</strong>{" "}
          {user.AboExpiration
            ? new Date(user.AboExpiration).toLocaleDateString()
            : "No subscription"}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-start gap-2 mb-1">
        <ButtonComponent
          text={"Update"}
          as={Link}
          to={"/Admin-manage-user-profile/" + user._id}
        />
        <ButtonComponent
          text={"View Exercise"}
          as={Link}
          to={"/user-exercises/" + user._id}
        />
      </Card.Footer>
    </Card>
  );
};

export default UserCard;
