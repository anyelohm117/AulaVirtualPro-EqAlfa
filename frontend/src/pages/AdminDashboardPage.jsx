import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AdminDashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [cursos, setCursos] = useState([]);
  const [reporte, setReporte] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [error, setError] = useState("");
  const [tabActiva, setTabActiva] = useState("cursos");

  useEffect(() => {
    cargarCursos();
    cargarReporte();
  }, []);

  const cargarCursos = async () => {
    setLoadingCursos(true);
    try {
      const res = await api.get("/cursos");
      setCursos(res.data);
    } catch {
      setError("No se pudieron cargar los cursos.");
    } finally {
      setLoadingCursos(false);
    }
  };

  const cargarReporte = async () => {
    setLoadingReporte(true);
    try {
      const res = await api.get("/reportes/admin");
      setReporte(res.data);
    } catch {
      setError("No se pudo cargar el reporte de alumnos.");
    } finally {
      setLoadingReporte(false);
    }
  };

  const eliminarCurso = async (id) => {
    if (!window.confirm("¿Desactivar este curso?")) return;
    try {
      await api.delete(`/cursos/${id}`);
      setCursos((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("No se pudo eliminar el curso.");
    }
  };

  // Estadísticas derivadas de datos reales
  const cursosActivos = cursos.filter((c) => c.activo).length;
  const totalAlumnos = reporte.length;
  const todasCalificaciones = reporte.flatMap((r) => r.calificaciones || []);
  const aprobadas = todasCalificaciones.filter((c) => c.aprobado).length;
  const tasaAprobacion = todasCalificaciones.length > 0
    ? Math.round((aprobadas / todasCalificaciones.length) * 100)
    : 0;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topbar}>
          <div style={styles.topLeft}>
            <h2 style={styles.topTitle}>Panel de administración</h2>
            <span style={styles.badgeAdmin}>Admin</span>
          </div>
          <div style={styles.topRight}>
            <span style={styles.adminName}>{usuario || "Administrador"}</span>
            <button style={styles.btnLogout} onClick={() => { logout(); navigate("/login"); }}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Cursos activos</p>
            <p style={styles.statVal}>{cursosActivos}</p>
            <p style={styles.statSub}>de {cursos.length} totales</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Alumnos registrados</p>
            <p style={styles.statVal}>{totalAlumnos}</p>
            <p style={styles.statSub}>activos en la plataforma</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Quizzes realizados</p>
            <p style={styles.statVal}>{todasCalificaciones.length}</p>
            <p style={styles.statSub}>en total</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Tasa de aprobación</p>
            <p style={styles.statVal}>{tasaAprobacion}%</p>
            <p style={styles.statSub}>promedio general</p>
          </div>
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tabActiva === "cursos" ? styles.tabActiva : {}) }}
            onClick={() => setTabActiva("cursos")}
          >
            Cursos
          </button>
          <button
            style={{ ...styles.tab, ...(tabActiva === "alumnos" ? styles.tabActiva : {}) }}
            onClick={() => setTabActiva("alumnos")}
          >
            Reporte de alumnos
          </button>
        </div>

        {tabActiva === "cursos" && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Cursos registrados</h3>
            </div>
            {loadingCursos ? (
              <p style={styles.emptyTxt}>Cargando cursos...</p>
            ) : cursos.length === 0 ? (
              <p style={styles.emptyTxt}>No hay cursos registrados.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Curso</th>
                    <th style={styles.th}>Módulos</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.map((c) => (
                    <tr key={c._id}>
                      <td style={styles.td}>{c.titulo}</td>
                      <td style={styles.td}>{c.modulos?.length ?? "—"}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          backgroundColor: c.activo ? "#dcfce7" : "#fef9c3",
                          color: c.activo ? "#15803d" : "#854d0e",
                        }}>
                          {c.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.actionBtn}
                          title="Ver curso"
                          onClick={() => navigate(`/course/${c._id}`)}
                        >
                          ✏️
                        </button>
                        <button
                          style={styles.actionBtn}
                          title="Desactivar"
                          onClick={() => eliminarCurso(c._id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tabActiva === "alumnos" && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Progreso y calificaciones por alumno</h3>
            </div>
            {loadingReporte ? (
              <p style={styles.emptyTxt}>Cargando reporte...</p>
            ) : reporte.length === 0 ? (
              <p style={styles.emptyTxt}>No hay alumnos registrados.</p>
            ) : (
              <div style={styles.reporteList}>
                {reporte.map((r) => (
                  <div key={r.alumno.id} style={styles.reporteCard}>
                    <div style={styles.reporteHeader}>
                      <span style={styles.reporteNombre}>{r.alumno.nombre}</span>
                      <span style={styles.reporteEmail}>{r.alumno.email}</span>
                    </div>

                    <div style={styles.reporteCol}>
                      <p style={styles.reporteColTitle}>Progreso por curso</p>
                      {r.progresos.length === 0 ? (
                        <p style={styles.emptyTxt}>Sin cursos iniciados.</p>
                      ) : (
                        r.progresos.map((p, i) => (
                          <div key={i} style={styles.reporteRow}>
                            <span>{p.curso || "Curso eliminado"}</span>
                            <span style={styles.reporteBold}>{p.porcentaje}%</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div style={styles.reporteCol}>
                      <p style={styles.reporteColTitle}>Calificaciones</p>
                      {r.calificaciones.length === 0 ? (
                        <p style={styles.emptyTxt}>Sin quizzes realizados.</p>
                      ) : (
                        r.calificaciones.map((c, i) => (
                          <div key={i} style={styles.reporteRow}>
                            <span>{c.quiz || "Quiz eliminado"}</span>
                            <span style={{
                              ...styles.badge,
                              backgroundColor: c.aprobado ? "#dcfce7" : "#fee2e2",
                              color: c.aprobado ? "#15803d" : "#dc2626",
                            }}>
                              {c.calificacion}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
    maxWidth: "960px",
    margin: "0 auto",
  },
  topbar: {
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  topTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  badgeAdmin: {
    backgroundColor: "#E6F1FB",
    color: "#185FA5",
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "99px",
    fontWeight: "600",
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  adminName: {
    fontSize: "13px",
    color: "#6b7280",
  },
  btnLogout: {
    padding: "6px 14px",
    backgroundColor: "#fff",
    color: "#dc2626",
    border: "0.5px solid #dc2626",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
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
  errorMsg: {
    padding: "10px 20px",
    fontSize: "12px",
    color: "#dc2626",
  },
  tabs: {
    display: "flex",
    borderBottom: "0.5px solid #e5e7eb",
    padding: "0 20px",
  },
  tab: {
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#6b7280",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  tabActiva: {
    color: "#185FA5",
    borderBottom: "2px solid #185FA5",
  },
  section: {
    padding: "16px 20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
  },
  emptyTxt: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "12px",
  },
  th: {
    textAlign: "left",
    padding: "6px 8px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
    borderBottom: "0.5px solid #e5e7eb",
  },
  td: {
    padding: "8px",
    color: "#111827",
    borderBottom: "0.5px solid #e5e7eb",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "99px",
    fontSize: "11px",
    fontWeight: "600",
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  reporteList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  reporteCard: {
    border: "0.5px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
  },
  reporteHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  reporteNombre: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
  },
  reporteEmail: {
    fontSize: "11px",
    color: "#9ca3af",
  },
  reporteCol: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  reporteColTitle: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "2px",
  },
  reporteRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#374151",
    padding: "2px 0",
  },
  reporteBold: {
    fontWeight: "600",
    color: "#185FA5",
  },
};
