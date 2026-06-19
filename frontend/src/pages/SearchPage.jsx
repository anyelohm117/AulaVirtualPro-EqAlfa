import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const NAV_ITEMS = [
  { icon: "🏠", label: "Inicio",      path: "/catalog" },
  { icon: "📚", label: "Mi progreso", path: "/progress" },
  { icon: "🔍", label: "+ Cursos",    path: "/search" },
];

export default function SearchPage() {
  const [query, setQuery]           = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCursos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/cursos");
        setCursos(res.data);
      } catch {
        setError("No se pudieron cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };
    cargarCursos();
  }, []);

  const resultados = cursos.filter((c) => {
    const q = query.toLowerCase();
    return !q || c.titulo.toLowerCase().includes(q) || (c.descripcion || "").toLowerCase().includes(q);
  });

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
            placeholder="Buscar por nombre o descripción del curso..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={s.searchInput}
          />
          <span style={s.searchIcon}>🔍</span>
        </div>

        <div style={s.filtrosBar}>
          <span style={s.resultCount}>{resultados.length} curso{resultados.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Grid de cursos */}
        {loading && <p style={s.empty}>Cargando cursos...</p>}
        {error && <p style={{ ...s.empty, color: "#dc2626" }}>{error}</p>}

        {!loading && !error && (
          <div style={s.grid}>
            {resultados.length === 0 ? (
              <p style={s.empty}>No se encontraron cursos con esos criterios.</p>
            ) : (
              resultados.map((curso) => (
                <div key={curso._id} style={s.card}>
                  <div style={s.cardThumb}>
                    {curso.imagen
                      ? <img src={curso.imagen} alt={curso.titulo} style={s.cardImg} onError={(e) => { e.target.style.display = "none"; }} />
                      : <span style={{ fontSize: "32px" }}>📚</span>
                    }
                  </div>
                  <div style={s.cardBody}>
                    <p style={s.cardNombre}>{curso.titulo}</p>
                    <p style={s.cardDesc}>{curso.descripcion || "Sin descripción disponible."}</p>
                    <button
                      style={s.btnInscribir}
                      onClick={() => navigate(`/course/${curso._id}`)}
                    >
                      Ver curso
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  },
  cardNombre: { fontSize: "13px", fontWeight: "600", color: "#111827", margin: 0, lineHeight: "1.4" },
  cardDesc: { fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: "1.5" },
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
