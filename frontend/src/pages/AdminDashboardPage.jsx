import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AdminDashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [cursos,   setCursos]   = useState([]);
  const [reporte,  setReporte]  = useState([]);   // GET /reportes/admin
  const [tabActiva, setTabActiva] = useState("cursos");
  const [loadingCursos,  setLoadingCursos]  = useState(true);
  const [loadingReporte, setLoadingReporte] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchCursos(); fetchReporte(); }, []);

  const fetchCursos = async () => {
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

  const fetchReporte = async () => {
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

  const handleEliminarCurso = async (id) => {
    if (!window.confirm("¿Eliminar este curso?")) return;
    try {
      await api.delete(`/cursos/${id}`);
      setCursos((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("No se pudo eliminar el curso.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Estadísticas derivadas de los datos reales
  const cursosActivos      = cursos.filter((c) => c.activo).length;
  const cursosInactivos    = cursos.filter((c) => !c.activo).length;
  const totalAlumnos       = reporte.length;
  const todasCalificaciones = reporte.flatMap((r) => r.calificaciones || []);
  const aprobadas          = todasCalificaciones.filter((c) => c.aprobado).length;
  const tasaAprobacion     = todasCalificaciones.length > 0
    ? Math.round((aprobadas / todasCalificaciones.length) * 100)
    : 0;

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.topLeft}>
            <h2 style={s.topTitle}>Panel de administración</h2>
            <span style={s.badgeAdmin}>Admin</span>
          </div>
          <div style={s.topRight}>
            <span style={s.adminName}>{usuario || "Administrador"}</span>
            <button style={s.btnLogout} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Stats reales */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <p style={s.statLabel}>Cursos activos</p>
            <p style={s.statVal}>{cursosActivos}</p>
            <p style={s.statSub}>{cursosInactivos} inactivos</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Alumnos</p>
            <p style={s.statVal}>{loadingReporte ? "…" : totalAlumnos}</p>
            <p style={s.statSub}>registrados en la plataforma</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Quizzes realizados</p>
            <p style={s.statVal}>{loadingReporte ? "…" : todasCalificaciones.length}</p>
            <p style={s.statSub}>en total</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Tasa de aprobación</p>
            <p style={s.statVal}>{loadingReporte ? "…" : `${tasaAprobacion}%`}</p>
            <p style={s.statSub}>promedio general</p>
          </div>
        </div>

        {error && <p style={s.errorMsg}>{error}</p>}

        {/* Tabs */}
        <div style={s.tabs}>
          {["cursos", "alumnos"].map((tab) => (
            <button
              key={tab}
              style={{ ...s.tab, ...(tabActiva === tab ? s.tabActiva : {}) }}
              onClick={() => setTabActiva(tab)}
            >
              {tab === "cursos" ? "Cursos" : "Reporte de alumnos"}
            </button>
          ))}
        </div>

        {/* ── Tab: Cursos ── */}
        {tabActiva === "cursos" && (
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h3 style={s.sectionTitle}>Cursos registrados</h3>
            </div>
            {loadingCursos ? (
              <p style={s.emptyTxt}>Cargando cursos...</p>
            ) : cursos.length === 0 ? (
              <p style={s.emptyTxt}>No hay cursos registrados.</p>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Curso</th>
                    <th style={s.th}>Módulos</th>
                    <th style={s.th}>Estado</th>
                    <th style={s.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.map((c) => (
                    <tr key={c._id}>
                      <td style={s.td}>{c.titulo}</td>
                      <td style={s.td}>{c.modulos?.length ?? "—"}</td>
                      <td style={s.td}>
                        <span style={{
                          ...s.badge,
                          backgroundColor: c.activo ? "#dcfce7" : "#fef9c3",
                          color:           c.activo ? "#15803d" : "#854d0e",
                        }}>
                          {c.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={s.td}>
                        <button
                          style={s.actionBtn}
                          title="Ver curso"
                          onClick={() => navigate(`/course/${c._id}`)}
                        >✏️</button>
                        <button
                          style={s.actionBtn}
                          title="Eliminar"
                          onClick={() => handleEliminarCurso(c._id)}
                        >🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab: Reporte de alumnos ── */}
        {tabActiva === "alumnos" && (
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <h3 style={s.sectionTitle}>Progreso y calificaciones por alumno</h3>
            </div>
            {loadingReporte ? (
              <p style={s.emptyTxt}>Cargando reporte...</p>
            ) : reporte.length === 0 ? (
              <p style={s.emptyTxt}>No hay alumnos registrados aún.</p>
            ) : (
              <div style={s.reporteList}>
                {reporte.map((r) => (
                  <div key={r.alumno.id} style={s.reporteCard}>
                    {/* Nombre / email */}
                    <div style={s.reporteCol}>
                      <p style={s.reporteNombre}>{r.alumno.nombre}</p>
                      <p style={s.reporteEmail}>{r.alumno.email}</p>
                    </div>

                    {/* Progreso */}
                    <div style={s.reporteCol}>
                      <p style={s.reporteColTitle}>Avance por curso</p>
                      {r.progresos.length === 0 ? (
                        <p style={s.emptyTxt}>Sin cursos iniciados.</p>
                      ) : r.progresos.map((p, i) => (
                        <div key={i} style={s.reporteRow}>
                          <span>{p.curso || "Curso eliminado"}</span>
                          <span style={s.reportePct}>{p.porcentaje}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Calificaciones */}
                    <div style={s.reporteCol}>
                      <p style={s.reporteColTitle}>Calificaciones</p>
                      {r.calificaciones.length === 0 ? (
                        <p style={s.emptyTxt}>Sin quizzes realizados.</p>
                      ) : r.calificaciones.map((c, i) => (
                        <div key={i} style={s.reporteRow}>
                          <span>{c.quiz || "Quiz eliminado"}</span>
                          <span style={{
                            ...s.badge,
                            backgroundColor: c.aprobado ? "#dcfce7" : "#fee2e2",
                            color:           c.aprobado ? "#15803d" : "#dc2626",
                          }}>
                            {c.calificacion}
                          </span>
                        </div>
                      ))}
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

const s = {
  page: {
    minHeight: "100vh", backgroundColor: "#f0f4f8",
    fontFamily: "Inter, sans-serif", padding: "2rem",
  },
  card: {
    backgroundColor: "#fff", borderRadius: "16px",
    border: "0.5px solid #e5e7eb", overflow: "hidden",
    maxWidth: "960px", margin: "0 auto",
  },
  topbar: {
    padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  topLeft:  { display: "flex", alignItems: "center", gap: "10px" },
  topTitle: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  badgeAdmin: {
    backgroundColor: "#E6F1FB", color: "#185FA5",
    fontSize: "11px", padding: "3px 10px",
    borderRadius: "99px", fontWeight: "600",
  },
  topRight:  { display: "flex", alignItems: "center", gap: "12px" },
  adminName: { fontSize: "13px", color: "#6b7280" },
  btnLogout: {
    padding: "6px 14px", backgroundColor: "#fff",
    color: "#dc2626", border: "0.5px solid #dc2626",
    borderRadius: "6px", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", fontFamily: "Inter, sans-serif",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px", padding: "16px 20px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  statCard: { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "14px" },
  statLabel: { fontSize: "11px", color: "#6b7280", marginBottom: "6px" },
  statVal:   { fontSize: "24px", fontWeight: "600", color: "#111827" },
  statSub:   { fontSize: "11px", color: "#6b7280", marginTop: "2px" },
  errorMsg:  { padding: "8px 20px", fontSize: "12px", color: "#dc2626" },
  tabs: {
    display: "flex", borderBottom: "0.5px solid #e5e7eb", padding: "0 20px",
  },
  tab: {
    padding: "10px 16px", fontSize: "13px", fontWeight: "500",
    color: "#6b7280", background: "none", border: "none",
    borderBottom: "2px solid transparent", cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  tabActiva: { color: "#185FA5", borderBottom: "2px solid #185FA5" },
  section:   { padding: "16px 20px" },
  sectionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "12px",
  },
  sectionTitle: { fontSize: "13px", fontWeight: "600", color: "#111827" },
  emptyTxt:     { fontSize: "12px", color: "#9ca3af" },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
  th: {
    textAlign: "left", padding: "6px 8px",
    fontSize: "11px", fontWeight: "600", color: "#6b7280",
    borderBottom: "0.5px solid #e5e7eb",
  },
  td: { padding: "8px", color: "#111827", borderBottom: "0.5px solid #e5e7eb" },
  badge: {
    display: "inline-block", padding: "2px 8px",
    borderRadius: "99px", fontSize: "11px", fontWeight: "600",
  },
  actionBtn: {
    background: "none", border: "none",
    cursor: "pointer", fontSize: "13px",
    padding: "2px 6px", borderRadius: "4px",
  },
  reporteList: { display: "flex", flexDirection: "column", gap: "12px" },
  reporteCard: {
    border: "0.5px solid #e5e7eb", borderRadius: "10px",
    padding: "14px", display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr", gap: "16px",
  },
  reporteCol:      { display: "flex", flexDirection: "column", gap: "4px" },
  reporteNombre:   { fontSize: "13px", fontWeight: "600", color: "#111827" },
  reporteEmail:    { fontSize: "11px", color: "#9ca3af" },
  reporteColTitle: { fontSize: "11px", fontWeight: "600", color: "#6b7280", marginBottom: "2px" },
  reporteRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: "12px", color: "#374151", padding: "2px 0",
  },
  reportePct: { fontWeight: "600", color: "#185FA5" },
};
