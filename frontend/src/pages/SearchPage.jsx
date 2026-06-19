import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const catalogoCursos = [
  { id: 1,  nombre: "Introducción a la programación", materia: "Programación",      profesor: "Ana Lopez",       costo: 0,    moneda: "MXN", descripcion: "Aprende los fundamentos: variables, condicionales y ciclos.", rating: 4.8, alumnos: 1240 },
  { id: 2,  nombre: "Gestión de proyectos Agile",     materia: "Administración",     profesor: "Carlos Mendez",   costo: 599,  moneda: "MXN", descripcion: "Metodologías ágiles para gestionar equipos y proyectos.", rating: 4.6, alumnos: 880 },
  { id: 3,  nombre: "Comunicación efectiva",          materia: "Habilidades blandas", profesor: "Laura García",   costo: 399,  moneda: "MXN", descripcion: "Técnicas de oratoria, escucha activa y negociación.", rating: 4.7, alumnos: 2100 },
  { id: 4,  nombre: "Marketing Digital",              materia: "Marketing",           profesor: "Roberto Torres",  costo: 799,  moneda: "MXN", descripcion: "SEO, redes sociales y estrategias de contenido.", rating: 4.5, alumnos: 1560 },
  { id: 5,  nombre: "Seguridad Informática",          materia: "Ciberseguridad",      profesor: "Miguel Ángel Ruiz", costo: 999, moneda: "MXN", descripcion: "Amenazas, vulnerabilidades y buenas prácticas.", rating: 4.9, alumnos: 730 },
  { id: 6,  nombre: "Excel Avanzado",                 materia: "Ofimática",           profesor: "Patricia Herrera", costo: 299, moneda: "MXN", descripcion: "Tablas dinámicas, macros VBA y dashboards.", rating: 4.8, alumnos: 3200 },
  { id: 7,  nombre: "Herramientas Digitales",         materia: "Tecnología",          profesor: "Ana Lopez",        costo: 0,   moneda: "MXN", descripcion: "Domina las herramientas más usadas en el trabajo moderno.", rating: 4.4, alumnos: 1890 },
  { id: 8,  nombre: "Python para Ciencia de Datos",   materia: "Programación",        profesor: "Diego Salas",      costo: 1199, moneda: "MXN", descripcion: "Pandas, NumPy, visualización y machine learning básico.", rating: 4.9, alumnos: 950 },
  { id: 9,  nombre: "Diseño UX/UI",                   materia: "Diseño",              profesor: "Valeria Cruz",     costo: 899, moneda: "MXN", descripcion: "Prototipado, wireframes y principios de usabilidad.", rating: 4.7, alumnos: 670 },
  { id: 10, nombre: "Inglés de Negocios",              materia: "Idiomas",             profesor: "Sandra Williams",  costo: 699, moneda: "MXN", descripcion: "Vocabulario, presentaciones y correos en inglés profesional.", rating: 4.6, alumnos: 1430 },
  { id: 11, nombre: "Liderazgo y trabajo en equipo",  materia: "Habilidades blandas", profesor: "Carlos Mendez",   costo: 499, moneda: "MXN", descripcion: "Habilidades de liderazgo, motivación y resolución de conflictos.", rating: 4.5, alumnos: 1120 },
  { id: 12, nombre: "SQL y Bases de Datos",           materia: "Programación",        profesor: "Diego Salas",      costo: 0,   moneda: "MXN", descripcion: "Consultas, joins, procedimientos y optimización.", rating: 4.8, alumnos: 2050 },
];

const NAV_ITEMS = [
  { icon: "🏠", label: "Inicio",      path: "/catalog" },
  { icon: "📚", label: "Mi progreso", path: "/progress" },
  { icon: "📋", label: "Tareas",      path: "/assignments" },
  { icon: "🔍", label: "+ Cursos",    path: "/search" },
];

const MATERIAS = ["Todas", ...Array.from(new Set(catalogoCursos.map(c => c.materia))).sort()];

export default function SearchPage() {
  const [query, setQuery]           = useState("");
  const [filtroMateria, setFiltroMateria] = useState("Todas");
  const [filtroPrecio, setFiltroPrecio]   = useState("todos");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const resultados = catalogoCursos.filter((c) => {
    const q = query.toLowerCase();
    const matchQ = !q ||
      c.nombre.toLowerCase().includes(q) ||
      c.profesor.toLowerCase().includes(q) ||
      c.materia.toLowerCase().includes(q);
    const matchM = filtroMateria === "Todas" || c.materia === filtroMateria;
    const matchP =
      filtroPrecio === "todos" ? true :
      filtroPrecio === "gratis" ? c.costo === 0 :
      c.costo > 0;
    return matchQ && matchM && matchP;
  });

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return "★".repeat(full) + (rating % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(rating));
  };

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
                backgroundColor: item.path === "/search" ? "rgba(255,255,255,0.1)" : "transparent",
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
          <button style={s.navItem} onClick={() => { logout(); navigate("/login"); }} title="Cerrar sesión">
            <span style={s.navIcon}>🚪</span>
            {sidebarAbierto && <span style={{ ...s.navLabel, color: "#f87171" }}>Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <h2 style={s.topTitle}>🔍 Explorar cursos</h2>
          <div style={s.userInfo}>
            <div style={s.avatar}>{usuario ? usuario.charAt(0).toUpperCase() : "U"}</div>
            <span style={s.userName}>Hola, {usuario || "Usuario"}</span>
          </div>
        </div>

        {/* Buscador */}
        <div style={s.searchSection}>
          <input
            type="text"
            placeholder="Buscar por materia, profesor o nombre del curso..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={s.searchInput}
          />
          <span style={s.searchIcon}>🔍</span>
        </div>

        {/* Filtros */}
        <div style={s.filtrosBar}>
          <div style={s.filtroGroup}>
            <span style={s.filtroLabel}>Materia:</span>
            <select
              value={filtroMateria}
              onChange={(e) => setFiltroMateria(e.target.value)}
              style={s.select}
            >
              {MATERIAS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={s.filtroGroup}>
            <span style={s.filtroLabel}>Precio:</span>
            {["todos", "gratis", "pago"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroPrecio(f)}
                style={{
                  ...s.filtroBtn,
                  backgroundColor: filtroPrecio === f ? "#185FA5" : "#f3f4f6",
                  color: filtroPrecio === f ? "#fff" : "#374151",
                }}
              >
                {f === "todos" ? "Todos" : f === "gratis" ? "Gratis" : "De pago"}
              </button>
            ))}
          </div>
          <span style={s.resultCount}>{resultados.length} curso{resultados.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Grid de cursos */}
        <div style={s.grid}>
          {resultados.length === 0 ? (
            <p style={s.empty}>No se encontraron cursos con esos criterios.</p>
          ) : (
            resultados.map((curso) => (
              <div key={curso.id} style={s.card}>
                <div style={s.cardThumb}>
                  <span style={{ fontSize: "32px" }}>📚</span>
                  <span style={{
                    ...s.precioTag,
                    backgroundColor: curso.costo === 0 ? "#d1fae5" : "#dbeafe",
                    color: curso.costo === 0 ? "#065f46" : "#1e40af",
                  }}>
                    {curso.costo === 0 ? "GRATIS" : `$${curso.costo.toLocaleString()} MXN`}
                  </span>
                </div>
                <div style={s.cardBody}>
                  <p style={s.cardMateria}>{curso.materia}</p>
                  <p style={s.cardNombre}>{curso.nombre}</p>
                  <p style={s.cardDesc}>{curso.descripcion}</p>
                  <div style={s.cardProfesor}>
                    <div style={s.miniAvatar}>{curso.profesor.charAt(0)}</div>
                    <span style={s.profesorNombre}>{curso.profesor}</span>
                  </div>
                  <div style={s.cardMeta}>
                    <span style={s.stars}>{renderStars(curso.rating)}</span>
                    <span style={s.rating}>{curso.rating}</span>
                    <span style={s.alumnos}>({curso.alumnos.toLocaleString()})</span>
                  </div>
                  <button style={s.btnInscribir}>
                    {curso.costo === 0 ? "Inscribirse gratis" : "Ver curso"}
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

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f0f4f8",
    position: "relative",
  },
  overlay: { position: "fixed", inset: 0, zIndex: 10, backgroundColor: "rgba(0,0,0,0.25)" },
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
  hLine: { display: "block", width: "20px", height: "2px", backgroundColor: "#85B7EB", borderRadius: "2px" },
  nav: { display: "flex", flexDirection: "column", width: "100%", gap: "2px", padding: "4px 0" },
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
    whiteSpace: "nowrap",
  },
  navIcon: { fontSize: "18px", width: "24px", textAlign: "center", flexShrink: 0 },
  navLabel: { fontSize: "13px", fontWeight: "500", color: "#d1e8fa" },
  main: { flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff", minWidth: 0 },
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
    width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#E6F1FB",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "600", color: "#185FA5",
  },
  userName: { fontSize: "13px", color: "#6b7280" },
  searchSection: {
    position: "relative",
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px 10px 36px",
    fontSize: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    color: "#111827",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    left: "32px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    pointerEvents: "none",
  },
  filtrosBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "10px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    flexWrap: "wrap",
  },
  filtroGroup: { display: "flex", alignItems: "center", gap: "6px" },
  filtroLabel: { fontSize: "12px", color: "#6b7280", fontWeight: "500", whiteSpace: "nowrap" },
  select: {
    padding: "4px 8px",
    fontSize: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#f9fafb",
    color: "#374151",
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
  },
  filtroBtn: {
    padding: "4px 12px",
    border: "none",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  resultCount: { fontSize: "12px", color: "#9ca3af", marginLeft: "auto" },
  grid: {
    padding: "16px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "14px",
    overflowY: "auto",
  },
  card: {
    border: "0.5px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  },
  cardThumb: {
    height: "90px",
    backgroundColor: "#EEF4FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  precioTag: {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    fontFamily: "Inter, sans-serif",
  },
  cardBody: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  },
  cardMateria: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#185FA5",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: 0,
  },
  cardNombre: { fontSize: "13px", fontWeight: "600", color: "#111827", margin: 0, lineHeight: "1.4" },
  cardDesc: { fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: "1.5" },
  cardProfesor: { display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" },
  miniAvatar: {
    width: "20px", height: "20px", borderRadius: "50%",
    backgroundColor: "#dbeafe", color: "#1e40af",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "10px", fontWeight: "700", flexShrink: 0,
  },
  profesorNombre: { fontSize: "11px", color: "#374151", fontWeight: "500" },
  cardMeta: { display: "flex", alignItems: "center", gap: "4px" },
  stars: { fontSize: "11px", color: "#f59e0b" },
  rating: { fontSize: "11px", fontWeight: "600", color: "#111827" },
  alumnos: { fontSize: "10px", color: "#9ca3af" },
  btnInscribir: {
    width: "100%",
    padding: "7px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    marginTop: "auto",
  },
  empty: { fontSize: "13px", color: "#6b7280", gridColumn: "1 / -1", textAlign: "center", padding: "2rem 0" },
};
