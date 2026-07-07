import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!nombre || !email || !password || !confirmar) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", { nombre, email, password });
      navigate("/login", { state: { mensaje: "Cuenta creada. Ya puedes iniciar sesión." } });
    } catch (err) {
      const msg = err.response?.data?.error || "Error al registrar. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.left}>
          <div style={styles.logoCircle}><span style={{ fontSize: "32px" }}>🎓</span></div>
          <h1 style={styles.appName}>AulaVirtual Pro</h1>
          <p style={styles.appSub}>LMS para capacitación empresarial</p>
          <div style={styles.beneficios}>
            <p style={styles.beneficio}>✓ Accede a todos los cursos</p>
            <p style={styles.beneficio}>✓ Sigue tu progreso</p>
            <p style={styles.beneficio}>✓ Evaluaciones automáticas</p>
          </div>
        </div>
        <div style={styles.divider} />
        <div style={styles.right}>
          <h2 style={styles.title}>Crear cuenta</h2>
          <p style={styles.subtitle}>Regístrate para empezar a aprender</p>

          <form onSubmit={handleRegister} noValidate>
            <div style={styles.field}>
              <label style={styles.label}>Nombre completo *</label>
              <input
                type="text"
                placeholder="Ej. María López"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Correo electrónico *</label>
              <input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Contraseña *</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirmar contraseña *</label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Creando cuenta..." : "CREAR CUENTA"}
            </button>

            <p style={styles.loginLink}>
              ¿Ya tienes cuenta?{" "}
              <span style={styles.link} onClick={() => navigate("/login")}>
                Iniciar sesión
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f4f8", fontFamily: "Inter, sans-serif", padding: "2rem 0" },
  card: { display: "flex", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: "780px", backgroundColor: "#fff" },
  left: { flex: 1, backgroundColor: "#1a3a5c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2.5rem 2rem", gap: "14px" },
  logoCircle: { width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#2a5a8c", display: "flex", alignItems: "center", justifyContent: "center" },
  appName: { color: "#fff", fontSize: "20px", fontWeight: "600", textAlign: "center" },
  appSub: { color: "#85B7EB", fontSize: "13px", textAlign: "center" },
  beneficios: { marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" },
  beneficio: { color: "#A7F3D0", fontSize: "12px" },
  divider: { width: "1px", backgroundColor: "#e5e7eb" },
  right: { flex: 1.2, padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" },
  title: { fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "4px" },
  subtitle: { fontSize: "12px", color: "#6b7280", marginBottom: "1.5rem" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "12px", fontWeight: "500", color: "#6b7280", marginBottom: "4px" },
  input: { width: "100%", padding: "9px 12px", fontSize: "14px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontFamily: "Inter, sans-serif", color: "#111827", backgroundColor: "#fff", boxSizing: "border-box" },
  btn: { width: "100%", padding: "10px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: "4px" },
  error: { textAlign: "center", fontSize: "12px", color: "#DC2626", marginBottom: "8px" },
  loginLink: { textAlign: "center", fontSize: "12px", color: "#6b7280", marginTop: "12px" },
  link: { color: "#185FA5", cursor: "pointer", fontWeight: "600" },
};