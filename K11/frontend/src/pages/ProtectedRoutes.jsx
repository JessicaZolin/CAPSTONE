import { UserAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, loading, mongoUser } = UserAuth();
  console.log(user, loading, mongoUser);

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
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;
