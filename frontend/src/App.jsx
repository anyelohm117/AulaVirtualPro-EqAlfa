import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import CoursePage from "./pages/CoursePage";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RegisterPage from "./pages/RegisterPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import SearchPage from "./pages/SearchPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";

/** Ruta privada: requiere sesión activa */
function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/** Ruta solo para admin */
function AdminRoute({ children }) {
  const { token, rol } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (rol !== "admin") return <Navigate to="/" replace />;
  return children;
}

/** Ruta solo para instructor */
function InstructorRoute({ children }) {
  const { token, rol } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (rol !== "instructor" && rol !== "admin") return <Navigate to="/" replace />;
  return children;
}

/** Redirección inteligente al home según rol */
function HomeRedirect() {
  const { token, rol } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (rol === "admin") return <Navigate to="/admin" replace />;
  if (rol === "instructor") return <Navigate to="/teacher" replace />;
  return <Navigate to="/catalog" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Redirección raíz por rol */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Alumno */}
          <Route path="/catalog" element={<PrivateRoute><CatalogPage /></PrivateRoute>} />
          <Route path="/course/:id" element={<PrivateRoute><CoursePage /></PrivateRoute>} />
          <Route path="/quiz/:id" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
          <Route path="/assignments" element={<PrivateRoute><AssignmentsPage /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />

          {/* Instructor / Profesor */}
          <Route path="/teacher" element={<InstructorRoute><TeacherDashboardPage /></InstructorRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
