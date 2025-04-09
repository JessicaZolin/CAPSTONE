import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
/* import { useSearch } from "../context/SearchContext"; */
import { useState } from "react";
/*  import "../color.css"; */

const NavBar = () => {
  // ---------------------------- useAuth hook to get the user and logout function,
  // ---------------------------- useNavigate hook to navigate to different pages,
  // ---------------------------- useSearch hook to get the search function
  const { user, logOut, mongoUser } = UserAuth();
  const navigate = useNavigate();
  /* const { setSearch } = useSearch(); */
 /*  const [query, setQuery] = useState(""); */
  const [expanded, setExpanded] = useState(false);

  console.log(mongoUser, user.photoURL, user);

  /*  const myProfile = async () => {
    const profile = await user.getIdToken();
    console.log(profile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/me`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profile}`,
          },
        }
      );
 */
  // ---------------------------- Function to handle search ----------------------------
  /*  const handleSearch = (e) => {
      e.preventDefault();
      setSearch(query);
    }; */

  // ---------------------------- Function to handle logout and navigate to the home page ----------------------------
  const handleLogout = () => {
    logOut();
    if (user === null) {
      navigate("/welcome");
    }
  };

  // ---------------------------- Profile default image
  const defaultProfileImage = user?.photoURL;

  // ---------------------------- Function to toggle the expanded state of the navbar ----------------------------
  const handleNavigation = () => {
    setExpanded(false);
  };

  // ---------------------------- Render the navbar ----------------------------
  return (
    <Navbar
      className="fixed-top shadow-sm background-546a76 text-white"
      expand="lg"
      // ---------------------------- Set the expanded state of the navbar
      expanded={expanded}
      onToggle={(isexpanded) => setExpanded(isexpanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleNavigation}>
          <img
            src="https://res.cloudinary.com/da9papeuy/image/upload/v1743969268/IMG_7617_asvxyk.jpg"
            alt=""
            style={{ width: "100px", height: "100px" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/" onClick={handleNavigation}>
              <h3>BE YOUR BEST SELF</h3>
            </Nav.Link>
          </Nav>

          {/*<Form className="m-auto" // onSubmit={handleSearch}>}
            <Row className="d-flex flex-nowrap">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  style={{ width: "500px", fontSize: "13pt" }}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    // setSearch(e.target.value); 
                  }}
                />
              </Col>
              <Col xs="auto">
                <Button
                  type="submit"
                  className="color-button-a9c7d1"
                  style={{ fontSize: "13pt" }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>*/}

          <Nav className="mt-2 mt-lg-0 ms-auto">
            <>
              <div className="d-flex align-items-center">
                <Image
                  src={mongoUser?.profileImage ||defaultProfileImage}
                  roundedCircle
                  width={50}
                  height={50}
                  className="me-2 object-fit-cover"
                />
                <NavDropdown
                  title={
                    mongoUser ? `Ciao, ${mongoUser.firstName} ${mongoUser.lastName}`
                      : `Ciao, ${user?.displayName}`
                  }
                  id="basic-nav-dropdown"
                  align="end"
                  style={{ fontSize: "13pt" }}
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/dashboard"
                    onClick={handleNavigation}
                    style={{ fontSize: "13pt" }}
                  >
                    Dashboard User
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {mongoUser?.role === "admin" && (
                    <NavDropdown.Item
                    as={Link}
                    to="/exercises/create"
                    onClick={handleNavigation}
                    style={{ fontSize: "13pt" }}
                  >
                    Add a new exercise
                  </NavDropdown.Item>
                  )}
                  <NavDropdown.Item
                    as={Link}
                    to="/blogPosts/create"
                    onClick={handleNavigation}
                    style={{ fontSize: "13pt" }}
                  >
                    My Training Plan
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/my-posts"
                    onClick={handleNavigation}
                    style={{ fontSize: "13pt" }}
                  >
                    My Exercise
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    onClick={handleNavigation}
                    style={{ fontSize: "13pt" }}
                  >
                    Manage Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleLogout}
                    style={{ fontSize: "13pt" }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
