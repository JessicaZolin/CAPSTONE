import { UserAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

const ProtectedRoutes = () => {
  const { user, loading } = UserAuth();
  console.log(user, loading);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (!user || user === undefined || user === null) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <>
      
      {/* <NavBar style={{ position: "fixed", zIndex: 100 }} /> */}
      <Outlet />
      {/* <Footer /> */}
    
    </>
  );
};

export default ProtectedRoutes;
