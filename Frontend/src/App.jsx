import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Workspaces from "./pages/Workspaces";
import Workspace from "./pages/Workspace";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/workspaces" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <Workspaces />
          </ProtectedRoute>
        }
      />

      <Route
    path="/workspace/:workspaceId/projects"
    element={
        <ProtectedRoute>
            <Projects />
        </ProtectedRoute>
    }
/>

      <Route
        path="/workspace/:workspaceId"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
