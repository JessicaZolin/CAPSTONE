import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
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

  // ---------------------------- Function to handle logout and navigate to the home page ----------------------------
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/welcome");
    } catch (error) {
      console.error("Error logging out:", error);
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
      className="fixed-top text-white"
      expand="lg"
      // ---------------------------- Set the expanded state of the navbar
      expanded={expanded}
      onToggle={(isexpanded) => setExpanded(isexpanded)}
      variant="dark"
      style={{
        minHeight: "100px",
        backgroundColor: "black"
      }}
    >
      <Container className="d-flex justify-content-between align-items-center">

        <Nav>
          {mongoUser && mongoUser.role === "admin" ? (
            <Nav.Link
              as={Link}
              to="/admin-home"
              onClick={handleNavigation}
              className="d-flex align-items-center gap-3 p-0"
            >
              <h3 className="m-0 fs-5 d-none d-md-flex">BE YOUR BEST SELF</h3>
              <img
                src="https://res.cloudinary.com/da9papeuy/image/upload/v1743969268/IMG_7617_asvxyk.jpg"
                alt="K11-logo"
                style={{ width: "100px", height: "100px" }}
              />
            </Nav.Link>
          ) : (
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleNavigation}
              className="d-flex align-items-center gap-3 p-0"
            >
              <h3 className="m-0 fs-5 d-none d-md-flex">BE YOUR BEST SELF</h3>
              <img
                src="https://res.cloudinary.com/da9papeuy/image/upload/v1743969268/IMG_7617_asvxyk.jpg"
                alt="K11-logo"
                style={{ width: "100px", height: "100px" }}
              />
            </Nav.Link>
          )}
        </Nav>
        {user && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mt-2 mt-lg-0 ms-auto">
                <>
                  <div className="d-flex align-items-center">
                    <Image
                      src={
                        mongoUser !== null
                          ? mongoUser?.profileImage
                          : user?.photoURL
                      }
                      roundedCircle
                      width={50}
                      height={50}
                      className="me-2 object-fit-cover"
                    />
                    <NavDropdown
                      title={
                        mongoUser
                          ? `Ciao, ${mongoUser.firstName} ${mongoUser.lastName}`
                          : `Ciao, ${user?.displayName}`
                      }
                      id={"dropdown-button-drop-up"}
                      align="end"
                      style={{ fontSize: "13pt" }}
                      data-bs-theme="dark"
                    >
                      {/* DASHBOARD */}
                      {mongoUser?.role === "admin" ? (
                        <NavDropdown.Item
                          as={Link}
                          to="/admin-dashboard"
                          onClick={handleNavigation}
                          style={{ fontSize: "13pt" }}
                        >
                          Dashboard Admin
                        </NavDropdown.Item>
                      ) : (
                        <NavDropdown.Item
                          as={Link}
                          to="/user-dashboard"
                          onClick={handleNavigation}
                          style={{ fontSize: "13pt" }}
                        >
                          Dashboard User
                        </NavDropdown.Item>
                      )}

                      <NavDropdown.Divider />

                      {/* MANAGE PROFILE */}
                      <NavDropdown.Item
                        as={Link}
                        to="/user-profile"
                        onClick={handleNavigation}
                        style={{ fontSize: "13pt" }}
                      >
                        Manage Profile
                      </NavDropdown.Item>

                      <NavDropdown.Divider />

                      {/* LOGOUT */}
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
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
