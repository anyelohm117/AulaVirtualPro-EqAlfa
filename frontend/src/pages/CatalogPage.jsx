import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

const NAV_ITEMS = [
  { icon: "🏠", label: "Inicio",        path: "/catalog" },
  { icon: "📚", label: "Mi progreso",   path: "/progress" },
  { icon: "📋", label: "Tareas",        path: "/assignments" },
  { icon: "🔍", label: "+ Cursos",      path: "/search" },
];

export default function CatalogPage() {
  const [busqueda, setBusqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [progresoPorCurso, setProgresoPorCurso] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

 useEffect(() => {
  const cargarCursos = async () => {
    try {
      const res = await api.get("/cursos");
      setCursos(res.data);

      const resProgreso = await api.get("/progreso");
      const mapa = {};
      resProgreso.data.forEach((p) => {
        mapa[p.cursoId?._id] = p.porcentaje;
      });
      setProgresoPorCurso(mapa);
    } catch (err) {
      setError("No se pudieron cargar los cursos.");
    } finally {
      setLoading(false);
    }
  };
  cargarCursos();
}, []);

  const cursosFiltrados = cursos.filter((c) =>
    c.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {sidebarAbierto && (
        <div style={styles.overlay} onClick={() => setSidebarAbierto(false)} />
      )}

      <div style={{ ...styles.sidebar, width: sidebarAbierto ? "220px" : "56px" }}>
        <button
          style={styles.hamburger}
          onClick={() => setSidebarAbierto((v) => !v)}
          title={sidebarAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          <span style={styles.hLine} />
          <span style={styles.hLine} />
          <span style={styles.hLine} />
        </button>

        <nav style={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              style={styles.navItem}
              onClick={() => { navigate(item.path); setSidebarAbierto(false); }}
              title={item.label}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {sidebarAbierto && <span style={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            style={styles.navItem}
            onClick={() => { logout(); navigate("/login"); }}
            title="Cerrar sesión"
          >
            <span style={styles.navIcon}>🚪</span>
            {sidebarAbierto && (
              <span style={{ ...styles.navLabel, color: "#f87171" }}>Cerrar sesión</span>
            )}
          </button>
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

        {loading ? (
          <p style={styles.empty}>Cargando cursos...</p>
        ) : error ? (
          <p style={{ ...styles.empty, color: "#dc2626" }}>{error}</p>
        ) : (
          <div style={styles.grid}>
            {cursosFiltrados.length === 0 ? (
              <p style={styles.empty}>No se encontraron cursos.</p>
            ) : (
              cursosFiltrados.map((curso) => (
                <div key={curso._id} style={styles.card}>
                  <div style={styles.thumb}>
                    <span style={{ fontSize: "28px" }}>🖼️</span>
                  </div>
                  <div style={styles.cardBody}>
                    <p style={styles.cardTitle}>{curso.titulo}</p>
                    <p style={styles.cardInstructor}>{curso.descripcion}</p>
                    <ProgressBar value={progresoPorCurso[curso._id] || 0} height={4} />
                    <button
                      style={styles.btnContinuar}
                      onClick={() => navigate(`/course/${curso._id}`)}
                    >
                      Continuar
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

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif", backgroundColor: "#f0f4f8", position: "relative" },
  overlay: { position: "fixed", inset: 0, zIndex: 10, backgroundColor: "rgba(0,0,0,0.25)" },
  sidebar: { backgroundColor: "#1a3a5c", display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "12px 0", gap: "4px", transition: "width 0.22s ease", overflow: "hidden", flexShrink: 0, position: "relative", zIndex: 20 },
  hamburger: { display: "flex", flexDirection: "column", gap: "5px", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", width: "56px", flexShrink: 0 },
  hLine: { display: "block", width: "20px", height: "2px", backgroundColor: "#85B7EB", borderRadius: "2px" },
  nav: { display: "flex", flexDirection: "column", width: "100%", gap: "2px", padding: "4px 0" },
  navItem: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", whiteSpace: "nowrap" },
  navIcon: { fontSize: "18px", width: "24px", textAlign: "center", flexShrink: 0 },
  navLabel: { fontSize: "13px", fontWeight: "500", color: "#d1e8fa", fontFamily: "Inter, sans-serif" },
  main: { flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#fff", minWidth: 0 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb" },
  topTitle: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  userInfo: { display: "flex", alignItems: "center", gap: "8px" },
  avatar: { width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "#185FA5" },
  userName: { fontSize: "13px", color: "#6b7280" },
  searchWrap: { padding: "12px 20px", borderBottom: "0.5px solid #e5e7eb" },
  searchInput: { width: "100%", padding: "8px 12px", fontSize: "13px", border: "0.5px solid #d1d5db", borderRadius: "8px", backgroundColor: "#f9fafb", color: "#111827", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" },
  grid: { padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" },
  card: { border: "0.5px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", backgroundColor: "#fff", cursor: "pointer" },
  thumb: { height: "80px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" },
  cardBody: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px" },
  cardTitle: { fontSize: "12px", fontWeight: "600", color: "#111827", lineHeight: "1.4" },
  cardInstructor: { fontSize: "11px", color: "#6b7280" },
  btnContinuar: { width: "100%", padding: "6px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: "2px" },
  empty: { fontSize: "13px", color: "#6b7280", textAlign: "center", padding: "2rem 0" },
};