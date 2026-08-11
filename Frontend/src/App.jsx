import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Workspaces from "./pages/Workspaces";
import Workspace from "./pages/Workspace";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                path="/workspaces"
                element={
                    <ProtectedRoute>
                        <Workspaces />
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

            <Route
                path="/workspace/:workspaceId/projects"
                element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/workspace/:workspaceId/projects/:projectId"
                element={
                    <ProtectedRoute>
                        <Project />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;