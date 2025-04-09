import { useState, useEffect } from "react";
import { Container, Row, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { UserAuth } from "../context/AuthContext";

const Welcome = () => {
  /* const [user, setUser] = useState(null); */
  const [isLoading, setIsLoading] = useState(true);
  const {logOut, user} = UserAuth();


  // -------------------------------------------------------- Handle logout
  const handleLogout = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      await logOut();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("Current user:", currentUser);
      }
      setIsLoading(false); // Set loading state to false once the user is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  

  return (
    <>
      {isLoading && user==null ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Container className="d-flex flex-column flex-md-row justify-content-center text-center pages gap-5 col-10">
          <Row className="bg-dark text-white rounded">
            <h1>Benvenuto in K11</h1>
            <h2>BE YOUR BEST SELF</h2>
          </Row>
          <Row className="gap-2">
           {/*  {!isLoading && user ? (
              <>
              <h3 className="text-center">Ciao, {user?.email}</h3>
              <Button type="submit" size="lg" onClick={handleLogout}>
                Logout
              </Button>
              </>
            ) : ( */}
              <>
                <Button type="submit" size="lg" as={Link} to="/login">
                  Login
                </Button>
                <Button type="submit" size="lg" as={Link} to="/register">
                  Registrati
                </Button>
              </>
            {/* )} */} 
          </Row>
        </Container>
      )}
    </>
  );
};

export default Welcome;
