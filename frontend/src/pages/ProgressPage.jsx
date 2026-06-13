import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const statsData = {
  cursosCompletados: 3,
  totalCursos: 6,
  quizzesAprobados: 8,
  totalQuizzes: 10,
  promedio: 85,
  horasEstudio: 24,
};

const cursosAvance = [
  { id: 1, nombre: "Introducción a la programación", progreso: 90 },
  { id: 2, nombre: "Gestión de proyectos", progreso: 65 },
  { id: 3, nombre: "Comunicación efectiva", progreso: 40 },
  { id: 4, nombre: "Marketing Digital", progreso: 20 },
];

const historialQuizzes = [
  { id: 1, quiz: "Quiz: Tipos de datos", curso: "Intro. programación", puntaje: 85, fecha: "2025-05-10", aprobado: true },
  { id: 2, quiz: "Quiz: Ciclos", curso: "Intro. programación", puntaje: 70, fecha: "2025-05-12", aprobado: true },
  { id: 3, quiz: "Quiz: Funciones", curso: "Intro. programación", puntaje: 55, fecha: "2025-05-14", aprobado: false },
];

export default function ProgressPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

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

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Cursos completados</p>
            <p style={styles.statVal}>{statsData.cursosCompletados}</p>
            <p style={styles.statSub}>de {statsData.totalCursos} inscritos</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Quizzes aprobados</p>
            <p style={styles.statVal}>{statsData.quizzesAprobados}</p>
            <p style={styles.statSub}>de {statsData.totalQuizzes} realizados</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Calificación promedio</p>
            <p style={styles.statVal}>{statsData.promedio}</p>
            <p style={styles.statSub}>sobre 100</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Horas de estudio</p>
            <p style={styles.statVal}>{statsData.horasEstudio}</p>
            <p style={styles.statSub}>esta semana</p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Avance por curso</h3>
          {cursosAvance.map((curso) => (
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
                    width: `${curso.progreso}%`,
                  }}
                />
              </div>
              <span style={styles.barPct}>{curso.progreso}%</span>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Historial de quizzes</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Quiz</th>
                <th style={styles.th}>Curso</th>
                <th style={styles.th}>Puntaje</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialQuizzes.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.quiz}</td>
                  <td style={styles.td}>{item.curso}</td>
                  <td style={styles.td}>{item.puntaje}/100</td>
                  <td style={styles.td}>{item.fecha}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: item.aprobado ? "#dcfce7" : "#fee2e2",
                        color: item.aprobado ? "#15803d" : "#dc2626",
                      }}
                    >
                      {item.aprobado ? "Aprobado" : "Reprobado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    padding: "2px 10px",
    borderRadius: "99px",
    fontSize: "11px",
    fontWeight: "600",
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