import { Card, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, mongoUser } = UserAuth();
  const navigate = useNavigate();

  console.log(mongoUser, user);

  return (
    <div className="container">
      <Button
        className="container-main align-items-center color-button-546a76-bg-white"
        onClick={() => navigate("/")}
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
        Back to the Homepage
      </Button>

      <Container className="my-5">
        {/* -------------------------------- Manage Exercises -------------------------------- */}
        <Row className="mb-3">
          <h4>
            Hello,{" "}
            {mongoUser
              ? mongoUser.firstName.charAt(0).toUpperCase() +
                mongoUser.firstName.slice(1) +
                " " +
                mongoUser.lastName.charAt(0).toUpperCase() +
                mongoUser.lastName.slice(1)
              : user.displayName}{" "}
            !
          </h4>
          {mongoUser.profileImage && (
            <img
              src={mongoUser.profileImage}
              alt="Profile"
              className="profile-image"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "30%",
              }}
            />
          )}
          <p className="mt-3">
            Here you can manage your exercises and profile.
          </p>
        </Row>
        <Row>
          <h2>Manage Exercises</h2>
          <div className="d-flex justify-content-between">
            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/exercises/create`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>Exercises</Card.Title>
                <Card.Text>Create a new exercise</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Row>

        {/* -------------------------------- Manage Users -------------------------------- */}
        <Row>
          <h2>Manage User</h2>
          <div className="d-flex justify-content-between gap-5">
            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/userslist`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>Users</Card.Title>
                <Card.Text>See and manage users</Card.Text>
              </Card.Body>
            </Card>

            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/exercises/create`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>Users Training Plan</Card.Title>
                <Card.Text>Add Training Plans</Card.Text>
              </Card.Body>
            </Card>

            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/exercises/create`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>Users Exercise</Card.Title>
                <Card.Text>See and manage exercises</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Row>

        {/* -------------------------------- Manage my profile -------------------------------- */}
        <Row>
          <h2>Manage My Profile</h2>
          <div className="d-flex justify-content-between gap-5">
            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/blogPosts/create`)} // TIDOOOOO
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>My Training Plan</Card.Title>
                <Card.Text>See your personal training plan</Card.Text>
              </Card.Body>
            </Card>

            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/my-posts`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>My Exercise</Card.Title>
                <Card.Text>See and modify and track your exercises.</Card.Text>
              </Card.Body>
            </Card>

            <Card
              className="col shadow mb-3 background-card selected"
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
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
