import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !lastName || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        nombre: name,
        apellidoPaterno: lastName,
        apellidoMaterno: middleName,
        fechaNacimiento: birthDate,
        telefono: phone,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("Error al registrar. Intenta de nuevo.");
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
          <h2 style={styles.title}>Registro</h2>

          <form onSubmit={handleRegister} noValidate>
            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input
                type="text"
                placeholder="Solo nombre (sin apellidos)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Apellido Paterno</label>
              <input
                type="text"
                placeholder="Solo apellido paterno"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Apellido Materno</label>
              <input
                type="text"
                placeholder="Solo apellido materno"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Fecha de nacimiento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Número de teléfono</label>
              <input
                type="tel"
                placeholder="123-456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
            </div>

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

            <div style={styles.field}>
              <label style={styles.label}>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Registrando..." : "FINALIZAR REGISTRO"}
            </button>

            <p style={styles.loginLink}>
              ¿Ya tienes cuenta?{" "}
              <span style={{ color: "#185FA5", cursor: "pointer", fontWeight: "600" }}
                onClick={() => navigate("/login")}>
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
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    display: "flex",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "780px",
    minHeight: "420px",
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
  logoIcon: {
    fontSize: "32px",
  },
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
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "1.5rem",
  },
  field: {
    marginBottom: "1rem",
  },
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
  forgot: {
    display: "block",
    textAlign: "right",
    fontSize: "12px",
    color: "#185FA5",
    cursor: "pointer",
    marginBottom: "1.25rem",
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
  },
  error: {
    textAlign: "center",
    fontSize: "12px",
    color: "#DC2626",
    marginTop: "10px",
  },
};