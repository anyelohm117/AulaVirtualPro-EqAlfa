import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import CoursePage from "./pages/CoursePage";
import QuizPage from "./pages/QuizPage";
import ProgressPage from "./pages/ProgressPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function PrivateRoute({ children, soloAdmin }) {
  const { token, rol } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (soloAdmin && rol !== "admin") return <Navigate to="/catalog" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalog" element={<PrivateRoute><CatalogPage /></PrivateRoute>} />
          <Route path="/course/:id" element={<PrivateRoute><CoursePage /></PrivateRoute>} />
          <Route path="/quiz/:id" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute soloAdmin><AdminDashboardPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}