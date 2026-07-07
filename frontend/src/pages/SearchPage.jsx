import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SearchPage() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [inscribiendo, setInscribiendo] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    cargarDisponibles();
  }, []);

  const cargarDisponibles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inscripciones/disponibles");
      setCursos(res.data);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirse = async (cursoId) => {
    setInscribiendo(cursoId);
    setMensaje({ texto: "", tipo: "" });
    try {
      await api.post(`/inscripciones/${cursoId}`);
      setCursos(prev =>
        prev.map(c => c._id === cursoId ? { ...c, yaInscrito: true } : c)
      );
      setMensaje({ texto: "¡Te inscribiste correctamente! Ya puedes verlo en Mis Cursos.", tipo: "ok" });
    } catch (err) {
      const msg = err.response?.data?.error || "Error al inscribirse.";
      setMensaje({ texto: msg, tipo: "error" });
    } finally {
      setInscribiendo(null);
    }
  };

  const cursosFiltrados = cursos.filter(c =>
    c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const disponibles = cursosFiltrados.filter(c => !c.yaInscrito);
  const inscritos   = cursosFiltrados.filter(c => c.yaInscrito);

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <button style={s.backBtn} onClick={() => navigate("/catalog")}>← Mis cursos</button>
        <h2 style={s.title}>Explorar cursos</h2>
      </div>

      <div style={s.searchWrap}>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={s.searchInput}
        />
      </div>

      {mensaje.texto && (
        <div style={{ ...s.banner, ...(mensaje.tipo === "ok" ? s.bannerOk : s.bannerErr) }}>
          {mensaje.texto}
          <button style={s.bannerClose} onClick={() => setMensaje({ texto: "", tipo: "" })}>✕</button>
        </div>
      )}

      {loading ? (
        <p style={s.empty}>Cargando cursos disponibles...</p>
      ) : (
        <div style={s.content}>
          {/* Cursos disponibles para inscribirse */}
          <div style={s.section}>
            <h3 style={s.sectionTitle}>
              Disponibles para inscribirse
              <span style={s.count}>{disponibles.length}</span>
            </h3>
            {disponibles.length === 0 ? (
              <p style={s.empty}>
                {busqueda ? "No se encontraron cursos con ese término." : "Ya estás inscrito en todos los cursos disponibles."}
              </p>
            ) : (
              <div style={s.grid}>
                {disponibles.map(curso => (
                  <div key={curso._id} style={s.card}>
                    <div style={s.thumb}>
                      {curso.imagen
                        ? <img src={curso.imagen} alt={curso.titulo} style={s.thumbImg} onError={e => e.target.style.display="none"} />
                        : <span style={{ fontSize: "32px" }}>📚</span>
                      }
                    </div>
                    <div style={s.cardBody}>
                      <p style={s.cardTitle}>{curso.titulo}</p>
                      <p style={s.cardDesc}>{curso.descripcion || "Sin descripción"}</p>
                      <div style={s.cardMeta}>
                        <span style={s.metaBadge}>
                          {curso.modulos?.length || 0} módulos
                        </span>
                        <span style={s.metaBadge}>
                          {curso.modulos?.reduce((acc, m) => acc + (m.lecciones?.length || 0), 0) || 0} lecciones
                        </span>
                      </div>
                      <button
                        style={{
                          ...s.btnInscribir,
                          ...(inscribiendo === curso._id ? s.btnDisabled : {}),
                        }}
                        onClick={() => handleInscribirse(curso._id)}
                        disabled={inscribiendo === curso._id}
                      >
                        {inscribiendo === curso._id ? "Inscribiendo..." : "Inscribirme"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cursos ya inscritos */}
          {inscritos.length > 0 && (
            <div style={s.section}>
              <h3 style={s.sectionTitle}>
                Ya inscrito
                <span style={{ ...s.count, backgroundColor: "#dcfce7", color: "#15803d" }}>{inscritos.length}</span>
              </h3>
              <div style={s.grid}>
                {inscritos.map(curso => (
                  <div key={curso._id} style={{ ...s.card, opacity: 0.7 }}>
                    <div style={s.thumb}>
                      {curso.imagen
                        ? <img src={curso.imagen} alt={curso.titulo} style={s.thumbImg} onError={e => e.target.style.display="none"} />
                        : <span style={{ fontSize: "32px" }}>📚</span>
                      }
                    </div>
                    <div style={s.cardBody}>
                      <p style={s.cardTitle}>{curso.titulo}</p>
                      <p style={s.cardDesc}>{curso.descripcion || "Sin descripción"}</p>
                      <button
                        style={s.btnYaInscrito}
                        onClick={() => navigate(`/course/${curso._id}`)}
                      >
                        ✓ Inscrito — Ir al curso
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "Inter, sans-serif" },
  topbar: { padding: "14px 20px", backgroundColor: "#fff", borderBottom: "0.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "14px" },
  backBtn: { background: "none", border: "none", color: "#185FA5", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", padding: 0 },
  title: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  searchWrap: { padding: "12px 20px", backgroundColor: "#fff", borderBottom: "0.5px solid #e5e7eb" },
  searchInput: { width: "100%", maxWidth: "480px", padding: "8px 12px", fontSize: "13px", border: "0.5px solid #d1d5db", borderRadius: "8px", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" },
  banner: { margin: "16px 20px 0", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  bannerOk: { backgroundColor: "#dcfce7", color: "#15803d" },
  bannerErr: { backgroundColor: "#fee2e2", color: "#991b1b" },
  bannerClose: { background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "inherit", padding: "0 4px" },
  content: { padding: "16px 20px" },
  section: { marginBottom: "28px" },
  sectionTitle: { fontSize: "13px", fontWeight: "600", color: "#111827", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" },
  count: { fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "99px", backgroundColor: "#E6F1FB", color: "#185FA5" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" },
  card: { backgroundColor: "#fff", borderRadius: "12px", border: "0.5px solid #e5e7eb", overflow: "hidden" },
  thumb: { height: "100px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardBody: { padding: "12px", display: "flex", flexDirection: "column", gap: "6px" },
  cardTitle: { fontSize: "13px", fontWeight: "600", color: "#111827", lineHeight: "1.3" },
  cardDesc: { fontSize: "11px", color: "#6b7280", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardMeta: { display: "flex", gap: "6px", flexWrap: "wrap" },
  metaBadge: { fontSize: "10px", padding: "2px 7px", borderRadius: "99px", backgroundColor: "#f3f4f6", color: "#374151" },
  btnInscribir: { width: "100%", padding: "8px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: "4px" },
  btnDisabled: { backgroundColor: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" },
  btnYaInscrito: { width: "100%", padding: "8px", backgroundColor: "#f0fdf4", color: "#15803d", border: "0.5px solid #86efac", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: "4px" },
  empty: { fontSize: "13px", color: "#9ca3af", textAlign: "center", padding: "2rem 0" },
};