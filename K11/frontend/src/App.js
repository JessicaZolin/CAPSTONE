import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Dashboard from "./pages/Dashboard"
import CreateNewExercise from "./pages/CreateNewExercise";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthContextProvider>
    <Router>
      <div className="main-container">
        <Routes>
          {/* Protected routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exercises/create" element={<CreateNewExercise />} />
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
    </AuthContextProvider>
  );
}

export default App;
