import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import UserDashboard from "./pages/UserDashboard";
import CreateNewExercise from "./pages/CreateNewExercise";
import ExerciseDetails from "./pages/ExerciseDetails";
import { AuthContextProvider } from "./context/AuthContext";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import EditExercise from "./pages/EditExercise";
import UserProfile from "./pages/UserProfile";
import AdminRoutes from "./pages/AdminRoutes";
import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./pages/UsersList";
import AdminManageUserProfile from "./pages/AdminManageUserProfile";
import MyExercise from "./pages/MyExercise";
import AdminSeeUserExercises from "./pages/AdminSeeUserExercises";
import CreateNewTrainingPlan from "./pages/CreateNewTrainingPlan";
import AdminHome from "./pages/AdminHome";
import TrainingPlansDetails from "./pages/TrainingPlansDetails";
import EditTrainingPlan from "./pages/EditTrainingPlan";
import AllTrainingPlans from "./pages/AllTrainingPlans";
import AllExerciseWithLogs from "./pages/AllExerciseWithLogs";
import AllExercise from "./pages/AllExercise";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div className="main-container">
          <NavBar style={{ position: "fixed", zIndex: 100 }} />
          <div
            className="d-flex justify-content-center"
            style={{
              paddingTop: "150px",
              paddingBottom: "50px",
              height: "100%",
              width: "100%",
              margin: "auto",
            }}
          >
            <Routes>
              {/* ---------------------------------  Protected routes -------------------------------- */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route
                  path="/exercises/:exerciseId"
                  element={<ExerciseDetails />}
                />
                <Route path="/my-exercises" element={<MyExercise />} />
                <Route
                  path="/trainingplans/:trainingPlanId"
                  element={<TrainingPlansDetails />}
                />
                <Route
                  path="/all-trainingplans"
                  element={<AllTrainingPlans />}
                />
                <Route path="/all-exercises" element={<AllExercise />} />
              </Route>

              {/* --------------------------------- Admin routes -------------------------------- */}
              <Route element={<AdminRoutes />}>
                <Route path="/admin-home" element={<AdminHome />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route
                  path="/exercises/create"
                  element={<CreateNewExercise />}
                />
                <Route
                  path="/exercises/edit/:exerciseId"
                  element={<EditExercise />}
                />
                <Route path="/userslist" element={<UsersList />} />

                <Route
                  path="/admin-manage-user-profile/:userId"
                  element={<AdminManageUserProfile />}
                />
                <Route
                  path="/all-exercises-with-userslog"
                  element={<AllExerciseWithLogs />}
                />
                <Route
                  path="/user-exercises/:userId"
                  element={<AdminSeeUserExercises />}
                />
                <Route
                  path="/trainingplans/create"
                  element={<CreateNewTrainingPlan />}
                />
                <Route
                  path="/trainingplans/edit/:trainingPlanId"
                  element={<EditTrainingPlan />}
                />
              </Route>
              {/* --------------------------------- Public routes -------------------------------- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/welcome" element={<Welcome />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
