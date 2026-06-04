import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/*export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Credenciales inválidas");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.usuario);
      navigate("/catalog");
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };
  */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Inicie sesión con cualquier correo y contraseña para continuar");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.usuario);
      navigate("/catalog");
    } catch (err) {
      setError("Credenciales inválidas");
      navigate("/catalog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.logoCircle}>
            <span style={styles.logoIcon}>🎓</span>
          </div>
          <h1 style={styles.appName}>AulaVirtual Pro</h1>
          <p style={styles.appSub}>LMS para capacitación empresarial</p>
        </div>

        <div style={styles.divider} />

        <div style={styles.right}>
          <h2 style={styles.title}>Iniciar sesión</h2>

          <form onSubmit={handleLogin} noValidate>
            <div style={styles.field}>
              <label style={styles.label}>Correo electrónico</label>
              <input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <span style={styles.forgot}>¿Olvidaste tu contraseña?</span>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Ingresando..." : "INGRESAR"}
            </button>
            <br />
            <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "12px" }}>
              ¿No tienes cuenta?{" "}
              <span
                style={{ color: "#185FA5", cursor: "pointer", fontWeight: "600" }}
                onClick={() => navigate("/register")}
              >
                Regístrate
              </span>
            </p>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    fontFamily: "Inter, sans-serif",
    padding: "2rem 0",
  },
  card: {
    display: "flex",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "780px",
    backgroundColor: "#fff",
  },
  left: {
    flex: 1,
    backgroundColor: "#1a3a5c",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem 2rem",
    gap: "16px",
  },
  logoCircle: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#2a5a8c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: { fontSize: "32px" },
  appName: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "600",
    textAlign: "center",
  },
  appSub: {
    color: "#85B7EB",
    fontSize: "13px",
    textAlign: "center",
  },
  divider: {
    width: "1px",
    backgroundColor: "#e5e7eb",
  },
  right: {
    flex: 1.2,
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflowY: "auto",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1.5rem",
  },
  field: { marginBottom: "0.75rem" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    color: "#111827",
    backgroundColor: "#fff",
  },
  btn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.5px",
    fontFamily: "Inter, sans-serif",
    marginTop: "10px",
  },
  error: {
    textAlign: "center",
    fontSize: "12px",
    color: "#DC2626",
    marginBottom: "8px",
  },
  loginLink: {
    textAlign: "center",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "12px",
  },
  loginLinkBtn: {
    color: "#185FA5",
    cursor: "pointer",
    fontWeight: "600",
  },
};