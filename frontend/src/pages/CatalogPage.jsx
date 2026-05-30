import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const cursosEjemplo = [
  { id: 1, titulo: "Introducción a la programación", instructor: "Ana Lopez", progreso: 65 },
  { id: 2, titulo: "Gestión de proyectos", instructor: "Ana Lopez", progreso: 40 },
  { id: 3, titulo: "Comunicación efectiva", instructor: "Ana Lopez", progreso: 80 },
  { id: 4, titulo: "Marketing Digital", instructor: "Ana Lopez", progreso: 20 },
  { id: 5, titulo: "Seguridad Informática", instructor: "Ana Lopez", progreso: 55 },
  { id: 6, titulo: "Excel Avanzado", instructor: "Ana Lopez", progreso: 90 },
];

export default function CatalogPage() {
  const [busqueda, setBusqueda] = useState("");
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const cursosFiltrados = cursosEjemplo.filter((c) =>
    c.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <i style={styles.sideIcon}>☰</i>
        <span style={{ ...styles.sideIcon, fontSize: "20px" }}>🏠</span>
        <span style={{ ...styles.sideIcon, fontSize: "20px" }}>📚</span>
        <span style={{ ...styles.sideIcon, fontSize: "20px" }}>📋</span>
        <span style={{ ...styles.sideIcon, fontSize: "20px" }}>🔍</span>
        <div style={{ marginTop: "auto" }}>
          <span
            style={{ ...styles.sideIcon, fontSize: "20px", cursor: "pointer" }}
            onClick={logout}
            title="Cerrar sesión"
          >
            🚪
          </span>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>Mis cursos</h2>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {usuario ? usuario.charAt(0).toUpperCase() : "U"}
            </div>
            <span style={styles.userName}>Hola, {usuario || "Usuario"}</span>
          </div>
        </div>

        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.grid}>
          {cursosFiltrados.length === 0 ? (
            <p style={styles.empty}>No se encontraron cursos.</p>
          ) : (
            cursosFiltrados.map((curso) => (
              <div key={curso.id} style={styles.card}>
                <div style={styles.thumb}>
                  <span style={{ fontSize: "28px" }}>🖼️</span>
                </div>
                <div style={styles.cardBody}>
                  <p style={styles.cardTitle}>{curso.titulo}</p>
                  <p style={styles.cardInstructor}>Instructor: {curso.instructor}</p>
                  <div style={styles.progressWrap}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${curso.progreso}%`,
                      }}
                    />
                  </div>
                  <p style={styles.progressPct}>{curso.progreso}%</p>
                  <button
                    style={styles.btnContinuar}
                    onClick={() => navigate(`/course/${curso.id}`)}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f0f4f8",
  },
  sidebar: {
    width: "56px",
    backgroundColor: "#1a3a5c",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 0",
    gap: "24px",
  },
  sideIcon: {
    fontSize: "22px",
    color: "#85B7EB",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
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
  searchWrap: {
    padding: "12px 20px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  searchInput: {
    width: "100%",
    padding: "8px 12px",
    fontSize: "13px",
    border: "0.5px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    color: "#111827",
    outline: "none",
    fontFamily: "Inter, sans-serif",
  },
  grid: {
    padding: "16px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
  },
  card: {
    border: "0.5px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  thumb: {
    height: "80px",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: "10px 12px",
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px",
    lineHeight: "1.4",
  },
  cardInstructor: {
    fontSize: "11px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  progressWrap: {
    height: "4px",
    backgroundColor: "#e5e7eb",
    borderRadius: "2px",
    marginBottom: "6px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "2px",
    backgroundColor: "#185FA5",
  },
  progressPct: {
    fontSize: "11px",
    color: "#185FA5",
    marginBottom: "8px",
  },
  btnContinuar: {
    width: "100%",
    padding: "6px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  empty: {
    fontSize: "13px",
    color: "#6b7280",
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "2rem 0",
  },
};