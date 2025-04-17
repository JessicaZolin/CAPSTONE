import { UserAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading";

const ProtectedRoutes = () => {
  const { user, loading, mongoUser, token } = UserAuth();
  console.log(user, loading, mongoUser, token);

  if (loading) {
    return (
      <Loading />
    )
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
