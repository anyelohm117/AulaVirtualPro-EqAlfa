import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Datos de ejemplo: clases con sus tareas
const clasesConTareas = [
  {
    id: 1,
    titulo: "Introducción a la programación",
    instructor: "Ana Lopez",
    color: "#185FA5",
    emoji: "💻",
    tareas: [
      { id: 101, titulo: "Ejercicio: Variables y tipos de datos", fechaEntrega: "2026-06-20", estado: "pendiente", descripcion: "Crear 5 variables de distintos tipos y mostrarlas en consola." },
      { id: 102, titulo: "Práctica: Condicionales", fechaEntrega: "2026-06-25", estado: "entregada", descripcion: "Resolver 3 problemas usando if/else." },
      { id: 103, titulo: "Proyecto: Mini calculadora", fechaEntrega: "2026-07-01", estado: "pendiente", descripcion: "Implementar suma, resta, multiplicación y división." },
    ],
  },
  {
    id: 2,
    titulo: "Gestión de proyectos",
    instructor: "Carlos Mendez",
    color: "#0d7c66",
    emoji: "📊",
    tareas: [
      { id: 201, titulo: "Caso de estudio: Alcance del proyecto", fechaEntrega: "2026-06-18", estado: "vencida", descripcion: "Analizar el caso proporcionado y definir el alcance." },
      { id: 202, titulo: "Diagrama de Gantt", fechaEntrega: "2026-06-28", estado: "pendiente", descripcion: "Crear un diagrama de Gantt para un proyecto ficticio de 2 semanas." },
    ],
  },
  {
    id: 3,
    titulo: "Comunicación efectiva",
    instructor: "Laura García",
    color: "#7c3aed",
    emoji: "🗣️",
    tareas: [
      { id: 301, titulo: "Ensayo: Escucha activa", fechaEntrega: "2026-06-22", estado: "entregada", descripcion: "Redactar un ensayo de 500 palabras sobre técnicas de escucha activa." },
      { id: 302, titulo: "Video: Presentación personal", fechaEntrega: "2026-07-05", estado: "pendiente", descripcion: "Grabar un video de 2 minutos presentándote profesionalmente." },
    ],
  },
  {
    id: 4,
    titulo: "Marketing Digital",
    instructor: "Roberto Torres",
    color: "#c2410c",
    emoji: "📱",
    tareas: [
      { id: 401, titulo: "Análisis FODA de marca", fechaEntrega: "2026-06-15", estado: "vencida", descripcion: "Realizar un análisis FODA de una marca de tu elección." },
      { id: 402, titulo: "Estrategia de redes sociales", fechaEntrega: "2026-07-10", estado: "pendiente", descripcion: "Diseñar un plan de contenido para Instagram por 1 mes." },
    ],
  },
  {
    id: 5,
    titulo: "Seguridad Informática",
    instructor: "Miguel Ángel Ruiz",
    color: "#1e40af",
    emoji: "🔒",
    tareas: [
      { id: 501, titulo: "Reporte: Vulnerabilidades comunes", fechaEntrega: "2026-06-30", estado: "pendiente", descripcion: "Documentar 5 vulnerabilidades OWASP Top 10 con ejemplos." },
    ],
  },
  {
    id: 6,
    titulo: "Excel Avanzado",
    instructor: "Patricia Herrera",
    color: "#15803d",
    emoji: "📈",
    tareas: [
      { id: 601, titulo: "Tablas dinámicas", fechaEntrega: "2026-06-19", estado: "entregada", descripcion: "Crear una tabla dinámica con el dataset proporcionado." },
      { id: 602, titulo: "Macros VBA básicas", fechaEntrega: "2026-07-08", estado: "pendiente", descripcion: "Grabar y editar una macro para automatizar un proceso repetitivo." },
      { id: 603, titulo: "Dashboard interactivo", fechaEntrega: "2026-07-15", estado: "pendiente", descripcion: "Diseñar un dashboard con gráficos y segmentaciones." },
    ],
  },
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Inicio",       path: "/catalog" },
  { icon: "📚", label: "Mi progreso",  path: "/progress" },
  { icon: "📋", label: "Tareas",       path: "/assignments" },
  { icon: "🔍", label: "+ Cursos",     path: "/search" },
];

const ESTADO_CONFIG = {
  pendiente:  { label: "Pendiente",  bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  entregada:  { label: "Entregada",  bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  vencida:    { label: "Vencida",    bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

export default function AssignmentsPage() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [clasesAbiertas, setClasesAbiertas] = useState({ 1: true });
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const toggleClase = (id) =>
    setClasesAbiertas((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalTareas = clasesConTareas.reduce((acc, c) => acc + c.tareas.length, 0);
  const pendientes  = clasesConTareas.reduce((acc, c) => acc + c.tareas.filter(t => t.estado === "pendiente").length, 0);
  const vencidas    = clasesConTareas.reduce((acc, c) => acc + c.tareas.filter(t => t.estado === "vencida").length, 0);

  const clasesFiltradas = clasesConTareas.map((clase) => ({
    ...clase,
    tareas: filtroEstado === "todos"
      ? clase.tareas
      : clase.tareas.filter(t => t.estado === filtroEstado),
  })).filter((c) => c.tareas.length > 0);

  return (
    <div style={s.page}>
      {sidebarAbierto && (
        <div style={s.overlay} onClick={() => setSidebarAbierto(false)} />
      )}

      {/* Sidebar */}
      <div style={{ ...s.sidebar, width: sidebarAbierto ? "220px" : "56px" }}>
        <button
          style={s.hamburger}
          onClick={() => setSidebarAbierto((v) => !v)}
          title={sidebarAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          <span style={s.hLine} />
          <span style={s.hLine} />
          <span style={s.hLine} />
        </button>

        <nav style={s.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              style={{
                ...s.navItem,
                backgroundColor: item.path === "/assignments" ? "rgba(255,255,255,0.1)" : "transparent",
              }}
              onClick={() => { navigate(item.path); setSidebarAbierto(false); }}
              title={item.label}
            >
              <span style={s.navIcon}>{item.icon}</span>
              {sidebarAbierto && <span style={s.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            style={s.navItem}
            onClick={() => { logout(); navigate("/login"); }}
            title="Cerrar sesión"
          >
            <span style={s.navIcon}>🚪</span>
            {sidebarAbierto && (
              <span style={{ ...s.navLabel, color: "#f87171" }}>Cerrar sesión</span>
            )}
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <h2 style={s.topTitle}>📋 Mis Tareas</h2>
          <div style={s.userInfo}>
            <div style={s.avatar}>{usuario ? usuario.charAt(0).toUpperCase() : "U"}</div>
            <span style={s.userName}>Hola, {usuario || "Usuario"}</span>
          </div>
        </div>

        {/* Resumen */}
        <div style={s.resumenRow}>
          <div style={{ ...s.chip, backgroundColor: "#f0f4f8", color: "#374151" }}>
            <span style={{ ...s.chipDot, backgroundColor: "#6b7280" }} />
            {totalTareas} total
          </div>
          <div style={{ ...s.chip, backgroundColor: "#fef3c7", color: "#92400e" }}>
            <span style={{ ...s.chipDot, backgroundColor: "#f59e0b" }} />
            {pendientes} pendientes
          </div>
          <div style={{ ...s.chip, backgroundColor: "#fee2e2", color: "#991b1b" }}>
            <span style={{ ...s.chipDot, backgroundColor: "#ef4444" }} />
            {vencidas} vencidas
          </div>
        </div>

        {/* Filtros */}
        <div style={s.filtros}>
          <span style={s.filtrosLabel}>Filtrar:</span>
          {["todos", "pendiente", "entregada", "vencida"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              style={{
                ...s.filtroBtn,
                backgroundColor: filtroEstado === f ? "#185FA5" : "#f3f4f6",
                color: filtroEstado === f ? "#fff" : "#374151",
              }}
            >
              {f === "todos" ? "Todos" : ESTADO_CONFIG[f].label}
            </button>
          ))}
        </div>

        {/* Lista de clases con tareas */}
        <div style={s.content}>
          {clasesFiltradas.length === 0 ? (
            <p style={s.empty}>No hay tareas con ese filtro.</p>
          ) : (
            clasesFiltradas.map((clase) => (
              <div key={clase.id} style={s.claseCard}>
                {/* Header de la clase */}
                <button
                  style={{ ...s.claseHeader, borderLeftColor: clase.color }}
                  onClick={() => toggleClase(clase.id)}
                >
                  <div style={s.claseHeaderLeft}>
                    <span style={s.claseEmoji}>{clase.emoji}</span>
                    <div>
                      <p style={s.claseTitulo}>{clase.titulo}</p>
                      <p style={s.claseInstructor}>Instructor: {clase.instructor}</p>
                    </div>
                  </div>
                  <div style={s.claseHeaderRight}>
                    <span style={{ ...s.badge, backgroundColor: clase.color + "22", color: clase.color }}>
                      {clase.tareas.length} {clase.tareas.length === 1 ? "tarea" : "tareas"}
                    </span>
                    <span style={{ ...s.chevron, transform: clasesAbiertas[clase.id] ? "rotate(180deg)" : "rotate(0deg)" }}>
                      ▼
                    </span>
                  </div>
                </button>

                {/* Tareas de la clase */}
                {clasesAbiertas[clase.id] && (
                  <div style={s.tareasList}>
                    {clase.tareas.map((tarea) => {
                      const est = ESTADO_CONFIG[tarea.estado] || ESTADO_CONFIG.pendiente;
                      return (
                        <div key={tarea.id} style={s.tareaItem}>
                          <div style={s.tareaLeft}>
                            <span style={{ ...s.estadoDot, backgroundColor: est.dot }} />
                            <div>
                              <p style={s.tareaTitulo}>{tarea.titulo}</p>
                              <p style={s.tareaDesc}>{tarea.descripcion}</p>
                            </div>
                          </div>
                          <div style={s.tareaRight}>
                            <span style={{ ...s.estadoBadge, backgroundColor: est.bg, color: est.color }}>
                              {est.label}
                            </span>
                            <p style={s.fechaEntrega}>
                              📅 {new Date(tarea.fechaEntrega + "T00:00:00").toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f0f4f8",
    position: "relative",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sidebar: {
    backgroundColor: "#1a3a5c",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "12px 0",
    gap: "4px",
    transition: "width 0.22s ease",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
    zIndex: 20,
  },
  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "10px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "56px",
    flexShrink: 0,
  },
  hLine: {
    display: "block",
    width: "20px",
    height: "2px",
    backgroundColor: "#85B7EB",
    borderRadius: "2px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "2px",
    padding: "4px 0",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    borderRadius: "0",
    whiteSpace: "nowrap",
  },
  navIcon: { fontSize: "18px", width: "24px", textAlign: "center", flexShrink: 0 },
  navLabel: { fontSize: "13px", fontWeight: "500", color: "#d1e8fa", fontFamily: "Inter, sans-serif" },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  topTitle: { fontSize: "16px", fontWeight: "600", color: "#111827", margin: 0 },
  userInfo: { display: "flex", alignItems: "center", gap: "8px" },
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
  userName: { fontSize: "13px", color: "#6b7280" },
  resumenRow: {
    display: "flex",
    gap: "8px",
    padding: "12px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    flexWrap: "wrap",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
  chipDot: { width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0 },
  filtros: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    flexWrap: "wrap",
  },
  filtrosLabel: { fontSize: "12px", color: "#6b7280", fontWeight: "500" },
  filtroBtn: {
    padding: "4px 12px",
    border: "none",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "all 0.15s",
  },
  content: { padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" },
  empty: { fontSize: "13px", color: "#6b7280", textAlign: "center", padding: "2rem 0" },
  claseCard: {
    border: "0.5px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  claseHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: "#f9fafb",
    border: "none",
    borderLeft: "4px solid #185FA5",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontFamily: "Inter, sans-serif",
  },
  claseHeaderLeft: { display: "flex", alignItems: "center", gap: "12px" },
  claseEmoji: { fontSize: "22px", flexShrink: 0 },
  claseTitulo: { fontSize: "13px", fontWeight: "600", color: "#111827", margin: 0 },
  claseInstructor: { fontSize: "11px", color: "#6b7280", margin: "2px 0 0" },
  claseHeaderRight: { display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 },
  badge: {
    padding: "3px 8px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
  chevron: {
    fontSize: "10px",
    color: "#6b7280",
    transition: "transform 0.2s",
    display: "inline-block",
  },
  tareasList: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  tareaItem: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderTop: "0.5px solid #f3f4f6",
    gap: "12px",
  },
  tareaLeft: { display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: 0 },
  estadoDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, marginTop: "4px" },
  tareaTitulo: { fontSize: "12px", fontWeight: "600", color: "#111827", margin: 0 },
  tareaDesc: { fontSize: "11px", color: "#6b7280", margin: "3px 0 0", lineHeight: "1.4" },
  tareaRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 },
  estadoBadge: {
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  },
  fechaEntrega: { fontSize: "10px", color: "#9ca3af", margin: 0 },
};
