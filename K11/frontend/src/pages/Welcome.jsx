import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";
import { ButtonComponent } from "../components/Buttons";
import Loading from "../components/Loading";

const Welcome = () => {
  /* const [user, setUser] = useState(null); */
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserAuth();

  // -------------------------------------------------------- Handle logout

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
      }
      setIsLoading(false); // Set loading state to false once the user is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <>
        <Container className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-5 col-10">
          <Col xs={12} lg={1} className="d-flex flex-column justify-content-center align-items-center gap-2">
            <img
              src="https://res.cloudinary.com/da9papeuy/image/upload/v1743969268/IMG_7617_asvxyk.jpg"
              alt="Logo"
              className="logo-welcome-page"
              style={{ width: "100px", height: "100px" }}
            />
          </Col>
          <Col xs={12} lg={4} className="d-flex flex-column justify-content-center align-items-center gap-2 bg-black text-white rounded">
            <h1>Benvenuto in K11</h1>
            <h2>BE YOUR BEST SELF</h2>
          </Col>
          <Col xs={12} lg={2}>
            <Row className="d-flex gap-2" > 
              <ButtonComponent
                text={"Login"}
                type="submit"
                size="lg"
                as={Link}
                to="/login"
              />
              <ButtonComponent
                text={"Register"}
                type="submit"
                size="lg"
                as={Link}
                to="/register"
              />
            </Row>
          </Col>
        </Container>
    </>
  );
};

export default Welcome;
