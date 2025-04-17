import { Card, Container, Row, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ButtonComponent } from "../components/Buttons";

function UserDashboard() {

  const { user,  mongoUser } = UserAuth();
  const navigate = useNavigate();

  console.log(mongoUser, user);

 return (
    <div className="container">
      <ButtonComponent text={"Homepage"} as={Link} to={mongoUser.role === "admin" ? "/admin-home" : "/"} />

      <Container className="p-4 my-5 rounded shadow">
        <Row className="mb-3">
          <h4>Hello, {mongoUser ? mongoUser.firstName.charAt(0).toUpperCase() + mongoUser.firstName.slice(1) + " " + mongoUser.lastName.charAt(0).toUpperCase() + mongoUser.lastName.slice(1) : user.displayName} !</h4>
          {mongoUser.profileImage && <img src={mongoUser.profileImage} alt="Profile" className="profile-image" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "30%"}} />}
          <p className="mt-3">Here you can manage your exercises and profile.</p>
          
        </Row>
        <Row>
          
          <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/all-trainingplans`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>Training Plans</Card.Title>
              <Card.Text>See all available training plans</Card.Text>
            </Card.Body>
          </Card>

          <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/my-exercises`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <Card.Title>My Exercise</Card.Title>
              <Card.Text>See and modify and track your exercises.</Card.Text>
            </Card.Body>
          </Card>

          <Card
            className="shadow mb-3 background-card selected"
            onClick={() => navigate(`/user-profile`)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="d-flex flex-column justify-content-evenly">
              <Card.Title>User Profile</Card.Title>
              <Card.Text>
                Modify your profile and change your password
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
  );
} 

export default UserDashboard;
