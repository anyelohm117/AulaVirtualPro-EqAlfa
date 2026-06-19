import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProgressPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [cursosAvance, setCursosAvance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProgreso = async () => {
      setLoading(true);
      setError("");
      try {
        const resCursos = await api.get("/cursos");
        const cursos = resCursos.data;

        const avance = await Promise.all(
          cursos.map(async (curso) => {
            try {
              const [detalle, progreso] = await Promise.all([
                api.get(`/cursos/${curso._id}`),
                api.get(`/progreso/${curso._id}`),
              ]);
              const totalLecciones = (detalle.data.modulos || []).reduce(
                (acc, m) => acc + (m.lecciones?.length || 0), 0
              );
              return {
                id: curso._id,
                nombre: curso.titulo,
                porcentaje: progreso.data.porcentaje || 0,
                totalLecciones,
                completadas: progreso.data.leccionesCompletadas?.length || 0,
              };
            } catch {
              return {
                id: curso._id,
                nombre: curso.titulo,
                porcentaje: 0,
                totalLecciones: 0,
                completadas: 0,
              };
            }
          })
        );

        setCursosAvance(avance);
      } catch (err) {
        setError("No se pudo cargar tu progreso.");
      } finally {
        setLoading(false);
      }
    };
    cargarProgreso();
  }, []);

  const cursosCompletados = cursosAvance.filter((c) => c.porcentaje === 100).length;
  const totalCursos = cursosAvance.length;
  const promedioGeneral = totalCursos > 0
    ? Math.round(cursosAvance.reduce((acc, c) => acc + c.porcentaje, 0) / totalCursos)
    : 0;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>Mi progreso</h2>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {usuario ? usuario.charAt(0).toUpperCase() : "U"}
            </div>
            <span style={styles.userName}>{usuario || "Usuario"}</span>
          </div>
        </div>

        {loading && <p style={styles.loadingMsg}>Cargando tu progreso...</p>}
        {error && <p style={{ ...styles.loadingMsg, color: "#dc2626" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Cursos completados</p>
                <p style={styles.statVal}>{cursosCompletados}</p>
                <p style={styles.statSub}>de {totalCursos} inscritos</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Avance promedio</p>
                <p style={styles.statVal}>{promedioGeneral}%</p>
                <p style={styles.statSub}>en todos tus cursos</p>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Avance por curso</h3>
              {cursosAvance.length === 0 ? (
                <p style={styles.emptyTxt}>Aún no tienes cursos.</p>
              ) : (
                cursosAvance.map((curso) => (
                  <div
                    key={curso.id}
                    style={styles.cursoRow}
                    onClick={() => navigate(`/course/${curso.id}`)}
                  >
                    <span style={styles.cursoNombre}>{curso.nombre}</span>
                    <div style={styles.barWrap}>
                      <div
                        style={{
                          ...styles.barFill,
                          width: `${curso.porcentaje}%`,
                        }}
                      />
                    </div>
                    <span style={styles.barPct}>{curso.porcentaje}%</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <div style={styles.footer}>
          <button
            style={styles.btnVolver}
            onClick={() => navigate("/catalog")}
          >
            ← Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "Inter, sans-serif",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "0.5px solid #e5e7eb",
    overflow: "hidden",
    maxWidth: "900px",
    margin: "0 auto",
  },
  topbar: {
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#E6F1FB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
    color: "#185FA5",
  },
  userName: {
    fontSize: "13px",
    color: "#6b7280",
  },
  loadingMsg: {
    padding: "32px 20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    padding: "16px 20px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  statCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "14px",
  },
  statLabel: {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "6px",
  },
  statVal: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
  },
  statSub: {
    fontSize: "11px",
    color: "#6b7280",
    marginTop: "2px",
  },
  section: {
    padding: "16px 20px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "12px",
  },
  emptyTxt: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  cursoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
    cursor: "pointer",
  },
  cursoNombre: {
    fontSize: "12px",
    color: "#111827",
    width: "200px",
    flexShrink: 0,
  },
  barWrap: {
    flex: 1,
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "3px",
  },
  barFill: {
    height: "100%",
    borderRadius: "3px",
    backgroundColor: "#185FA5",
  },
  barPct: {
    fontSize: "11px",
    color: "#185FA5",
    width: "36px",
    textAlign: "right",
    flexShrink: 0,
  },
  footer: {
    padding: "14px 20px",
    display: "flex",
    justifyContent: "flex-start",
  },
  btnVolver: {
    padding: "9px 20px",
    backgroundColor: "#fff",
    color: "#185FA5",
    border: "0.5px solid #185FA5",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
};
