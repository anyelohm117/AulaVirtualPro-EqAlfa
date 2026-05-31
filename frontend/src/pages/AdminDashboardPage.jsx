import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const usuariosIniciales = [
  { id: 1, nombre: "Alan Santillan", correo: "alan@empresa.com", rol: "Alumno", cursos: 4, activo: true },
  { id: 2, nombre: "Ana Lopez", correo: "ana@empresa.com", rol: "Instructor", cursos: 6, activo: true },
  { id: 3, nombre: "Carlos Ruiz", correo: "carlos@empresa.com", rol: "Alumno", cursos: 2, activo: false },
];

const cursosIniciales = [
  { id: 1, titulo: "Introducción a la programación", instructor: "Ana Lopez", alumnos: 38, promedio: 82, publicado: true },
  { id: 2, titulo: "Gestión de proyectos", instructor: "Ana Lopez", alumnos: 25, promedio: 75, publicado: true },
  { id: 3, titulo: "Marketing Digital", instructor: "Ana Lopez", alumnos: 0, promedio: null, publicado: false },
];

const statsData = {
  totalUsuarios: 142,
  nuevosEsteMes: 8,
  cursosActivos: 12,
  cursosBorrador: 3,
  quizzesTotales: 48,
  tasaAprobacion: 78,
};

export default function AdminDashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [cursos, setCursos] = useState(cursosIniciales);
  const [tabActiva, setTabActiva] = useState("usuarios");

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const eliminarCurso = (id) => {
    setCursos((prev) => prev.filter((c) => c.id !== id));
  };

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
            <button style={styles.btnLogout} onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total usuarios</p>
            <p style={styles.statVal}>{statsData.totalUsuarios}</p>
            <p style={styles.statSub}>+{statsData.nuevosEsteMes} este mes</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Cursos activos</p>
            <p style={styles.statVal}>{statsData.cursosActivos}</p>
            <p style={styles.statSub}>{statsData.cursosBorrador} en borrador</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Quizzes totales</p>
            <p style={styles.statVal}>{statsData.quizzesTotales}</p>
            <p style={styles.statSub}>esta semana</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Tasa de aprobación</p>
            <p style={styles.statVal}>{statsData.tasaAprobacion}%</p>
            <p style={styles.statSub}>promedio general</p>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tabActiva === "usuarios" ? styles.tabActiva : {}) }}
            onClick={() => setTabActiva("usuarios")}
          >
            Usuarios
          </button>
          <button
            style={{ ...styles.tab, ...(tabActiva === "cursos" ? styles.tabActiva : {}) }}
            onClick={() => setTabActiva("cursos")}
          >
            Cursos
          </button>
        </div>

        {tabActiva === "usuarios" && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Usuarios registrados</h3>
              <button style={styles.btnAdd}>+ Nuevo usuario</button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Correo</th>
                  <th style={styles.th}>Rol</th>
                  <th style={styles.th}>Cursos</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.nombre}</td>
                    <td style={styles.td}>{u.correo}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: u.rol === "Instructor" ? "#E6F1FB" : "#f3f4f6",
                        color: u.rol === "Instructor" ? "#185FA5" : "#374151",
                      }}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={styles.td}>{u.cursos}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: u.activo ? "#dcfce7" : "#fef9c3",
                        color: u.activo ? "#15803d" : "#854d0e",
                      }}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn} title="Editar">✏️</button>
                      <button
                        style={styles.actionBtn}
                        title="Eliminar"
                        onClick={() => eliminarUsuario(u.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tabActiva === "cursos" && (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Cursos registrados</h3>
              <button style={styles.btnAdd}>+ Nuevo curso</button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Curso</th>
                  <th style={styles.th}>Instructor</th>
                  <th style={styles.th}>Alumnos</th>
                  <th style={styles.th}>Promedio</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cursos.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}>{c.titulo}</td>
                    <td style={styles.td}>{c.instructor}</td>
                    <td style={styles.td}>{c.alumnos}</td>
                    <td style={styles.td}>{c.promedio ? `${c.promedio}%` : "—"}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: c.publicado ? "#dcfce7" : "#fef9c3",
                        color: c.publicado ? "#15803d" : "#854d0e",
                      }}>
                        {c.publicado ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.actionBtn}
                        title="Ver curso"
                        onClick={() => navigate(`/course/${c.id}`)}
                      >
                        ✏️
                      </button>
                      <button
                        style={styles.actionBtn}
                        title="Eliminar"
                        onClick={() => eliminarCurso(c.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  btnAdd: {
    padding: "6px 14px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
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
};