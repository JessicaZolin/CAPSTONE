import { UserAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
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

  if (mongoUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminRoutes;
