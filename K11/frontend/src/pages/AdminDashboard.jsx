import { Card, Container, Row } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ButtonComponent } from "../components/Buttons";

// -----------------------------------------------------------------------------------------------

function AdminDashboard() {
  const { user, mongoUser } = UserAuth();
  const navigate = useNavigate();

  console.log(mongoUser, user);

  // -----------------------------------------------------------------------------------------------

  return (
    <div className="container">
      <ButtonComponent text={"Homepage"} type={"submit"} as={Link} to={"/admin-home"}/>
      <Container className="p-4 my-5 rounded shadow">
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

        {/* -------------------------------- Manage Exercises -------------------------------- */}
        <Row className="mb-5">
          <h2>Manage Exercises</h2>

          <Row>
            <div className="d-flex flex-column flex-md-row justify-content-between gap-md-5">
              {/* --------- CREATE EXERCISES --------- */}
              <Card
                className="col shadow mb-3 background-card selected"
                onClick={() => navigate(`/exercises/create`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title className="m-0">Create a new Exercise</Card.Title>
                </Card.Body>
              </Card>

              {/* --------- CREATE TRAINING PLANS --------- */}
              <Card
                className="col shadow mb-3 background-card selected"
                onClick={() => navigate(`/trainingplans/create`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title className="m-0">
                    Create a new Training Plan
                  </Card.Title>
                </Card.Body>
              </Card>
            </div>
          </Row>

          <Row>
            <div className="d-flex flex-column flex-md-row justify-content-between gap-md-5">
              {/* --------- ALL EXERCISES --------- */}
              <Card
                className="col shadow mb-3 background-card selected"
                onClick={() => navigate(`/all-exercises`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title className="m-0">See All Exercise</Card.Title>
                </Card.Body>
              </Card>

              {/* --------- ALL TRAINING PLANS --------- */}
              <Card
                className="col shadow mb-3 background-card selected"
                onClick={() => navigate(`/all-trainingplans`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title className="m-0">
                    See All Training Plans
                  </Card.Title>
                </Card.Body>
              </Card>

              {/* --------- USERS EXERCISES --------- */}
              <Card
                className="col shadow mb-3 background-card selected"
                onClick={() => navigate(`/all-exercises-with-userslog`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <Card.Title className="m-0">
                    See All Exercise with userslog
                  </Card.Title>
                </Card.Body>
              </Card>
            </div>
          </Row>
        </Row>

        {/* -------------------------------- Manage Users -------------------------------- */}
        <Row className="mb-5">
          <h2>Manage User</h2>
          <div className="d-flex justify-content-between gap-5">
            {/* --------- USERS --------- */}
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
          </div>
        </Row>

        {/* -------------------------------- Manage my profile -------------------------------- */}
        <Row>
          <h2>Manage My Profile</h2>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-md-5">
            {/* ----------- MY EXERCISES ----------- */}
            <Card
              className="col shadow mb-3 background-card selected"
              onClick={() => navigate(`/my-exercises`)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>My Exercise</Card.Title>
                <Card.Text>See and modify and track your exercises.</Card.Text>
              </Card.Body>
            </Card>

            {/* ----------- MY PROFILE ----------- */}
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
