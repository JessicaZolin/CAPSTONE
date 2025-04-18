import { UserAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading";

const AdminRoutes = () => {
  const { user, loading, mongoUser } = UserAuth();

  if (loading) {
    return (
      <Loading />
    )
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
