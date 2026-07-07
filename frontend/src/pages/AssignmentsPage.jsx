import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [modalTarea, setModalTarea] = useState(null);
  const [comentario, setComentario] = useState("");
  const [entregando, setEntregando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tareas/mis-tareas");
      setTareas(res.data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEntregar = async (e) => {
    e.preventDefault();
    setEntregando(true);
    try {
      await api.post(`/tareas/${modalTarea._id}/entregar`, { comentario });
      setMensaje({ texto: "¡Tarea entregada correctamente!", tipo: "ok" });
      setModalTarea(null);
      setComentario("");
      await cargarTareas();
    } catch (err) {
      setMensaje({ texto: err.response?.data?.error || "Error al entregar.", tipo: "error" });
    } finally {
      setEntregando(false);
    }
  };

  const tareasFiltradas = tareas.filter(t => {
    if (filtro === "pendientes") return t.estado === "pendiente";
    if (filtro === "entregadas") return t.estado === "entregada" || t.estado === "calificada";
    if (filtro === "vencidas")   return t.estado === "vencida";
    return true;
  });

  const colorEstado = (estado) => {
    if (estado === "entregada" || estado === "calificada") return { bg: "#dcfce7", color: "#15803d" };
    if (estado === "vencida") return { bg: "#fee2e2", color: "#991b1b" };
    return { bg: "#fef9c3", color: "#854d0e" };
  };

  const diasRestantes = (fecha) => {
    const diff = new Date(fecha) - new Date();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (dias < 0) return "Vencida";
    if (dias === 0) return "Vence hoy";
    return `${dias} día${dias !== 1 ? "s" : ""} restante${dias !== 1 ? "s" : ""}`;
  };

  const pendientes  = tareas.filter(t => t.estado === "pendiente").length;
  const entregadas  = tareas.filter(t => t.estado === "entregada" || t.estado === "calificada").length;
  const vencidas    = tareas.filter(t => t.estado === "vencida").length;

  return (
    <div style={s.page}>
      {/* Modal entrega */}
      {modalTarea && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>Entregar tarea</h3>
              <button style={s.closeBtn} onClick={() => { setModalTarea(null); setComentario(""); }}>✕</button>
            </div>
            <div style={s.modalBody}>
              <p style={s.modalTareaNombre}>{modalTarea.titulo}</p>
              <p style={s.modalCurso}>{modalTarea.cursoId?.titulo}</p>
              <form onSubmit={handleEntregar}>
                <label style={s.label}>Comentario de entrega (opcional)</label>
                <textarea
                  style={s.textarea}
                  placeholder="Describe tu trabajo o agrega notas para el instructor..."
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  rows={4}
                />
                <div style={s.modalActions}>
                  <button type="button" style={s.btnSec}
                    onClick={() => { setModalTarea(null); setComentario(""); }}>
                    Cancelar
                  </button>
                  <button type="submit" style={s.btnPrimary} disabled={entregando}>
                    {entregando ? "Entregando..." : "Confirmar entrega"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div style={s.topbar}>
        <button style={s.backBtn} onClick={() => navigate("/catalog")}>← Mis cursos</button>
        <h2 style={s.title}>Mis tareas</h2>
        <span style={s.alumnoName}>{usuario}</span>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <p style={s.statNum}>{tareas.length}</p>
          <p style={s.statLabel}>Total</p>
        </div>
        <div style={{ ...s.statCard, borderTop: "3px solid #f59e0b" }}>
          <p style={s.statNum}>{pendientes}</p>
          <p style={s.statLabel}>Pendientes</p>
        </div>
        <div style={{ ...s.statCard, borderTop: "3px solid #10b981" }}>
          <p style={s.statNum}>{entregadas}</p>
          <p style={s.statLabel}>Entregadas</p>
        </div>
        <div style={{ ...s.statCard, borderTop: "3px solid #ef4444" }}>
          <p style={s.statNum}>{vencidas}</p>
          <p style={s.statLabel}>Vencidas</p>
        </div>
      </div>

      {mensaje.texto && (
        <div style={{ ...s.banner, ...(mensaje.tipo === "ok" ? s.bannerOk : s.bannerErr) }}>
          {mensaje.texto}
          <button style={s.bannerClose} onClick={() => setMensaje({ texto: "", tipo: "" })}>✕</button>
        </div>
      )}

      {/* Filtros */}
      <div style={s.filtros}>
        {["todas", "pendientes", "entregadas", "vencidas"].map(f => (
          <button key={f} style={{ ...s.filtroBtn, ...(filtro === f ? s.filtroBtnActivo : {}) }}
            onClick={() => setFiltro(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de tareas */}
      <div style={s.list}>
        {loading ? (
          <p style={s.empty}>Cargando tareas...</p>
        ) : tareasFiltradas.length === 0 ? (
          <div style={s.emptyState}>
            <p style={{ fontSize: "32px", marginBottom: "10px" }}>
              {filtro === "todas" ? "📋" : "✅"}
            </p>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>
              {filtro === "todas"
                ? "No tienes tareas asignadas"
                : `No hay tareas ${filtro}`}
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              {filtro === "todas"
                ? "Inscríbete en cursos para recibir tareas de tus instructores"
                : "Prueba con otro filtro"}
            </p>
            {filtro === "todas" && (
              <button style={{ ...s.btnPrimary, marginTop: "16px" }}
                onClick={() => navigate("/search")}>
                Explorar cursos
              </button>
            )}
          </div>
        ) : (
          tareasFiltradas.map(tarea => {
            const est = colorEstado(tarea.estado);
            const dias = diasRestantes(tarea.fechaEntrega);
            const puedaEntregar = tarea.estado === "pendiente";
            return (
              <div key={tarea._id} style={s.tareaCard}>
                <div style={s.tareaLeft}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <p style={s.tareaTitulo}>{tarea.titulo}</p>
                    <span style={{ ...s.estadoBadge, backgroundColor: est.bg, color: est.color }}>
                      {tarea.estado}
                    </span>
                  </div>
                  <p style={s.tareaCurso}>{tarea.cursoId?.titulo}</p>
                  {tarea.descripcion && <p style={s.tareaDesc}>{tarea.descripcion}</p>}
                  {tarea.entrega?.comentario && (
                    <p style={s.entregaComentario}>
                      💬 Tu entrega: "{tarea.entrega.comentario}"
                    </p>
                  )}
                  {tarea.entrega?.calificacion !== null && tarea.entrega?.calificacion !== undefined && (
                    <p style={s.calificacion}>
                      ⭐ Calificación: {tarea.entrega.calificacion} / {tarea.puntos}
                    </p>
                  )}
                </div>
                <div style={s.tareaRight}>
                  <p style={{
                    ...s.dias,
                    color: dias === "Vencida" ? "#dc2626" : dias === "Vence hoy" ? "#d97706" : "#374151",
                  }}>
                    📅 {dias}
                  </p>
                  <p style={s.puntos}>{tarea.puntos} pts</p>
                  {puedaEntregar && (
                    <button style={s.btnEntregar} onClick={() => setModalTarea(tarea)}>
                      Entregar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "Inter, sans-serif" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { backgroundColor: "#fff", borderRadius: "12px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" },
  modalHead: { padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#6b7280" },
  modalBody: { padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  modalTareaNombre: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  modalCurso: { fontSize: "12px", color: "#6b7280" },
  label: { fontSize: "12px", fontWeight: "500", color: "#374151", display: "block", marginBottom: "6px" },
  textarea: { width: "100%", padding: "9px 12px", fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontFamily: "Inter, sans-serif", color: "#111827", resize: "vertical", boxSizing: "border-box" },
  modalActions: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" },
  topbar: { padding: "14px 20px", backgroundColor: "#fff", borderBottom: "0.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "14px" },
  backBtn: { background: "none", border: "none", color: "#185FA5", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif", padding: 0 },
  title: { fontSize: "16px", fontWeight: "600", color: "#111827", flex: 1 },
  alumnoName: { fontSize: "12px", color: "#6b7280" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", padding: "16px 20px", backgroundColor: "#fff", borderBottom: "0.5px solid #e5e7eb" },
  statCard: { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "12px", textAlign: "center", borderTop: "3px solid #e5e7eb" },
  statNum: { fontSize: "22px", fontWeight: "600", color: "#111827" },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },
  banner: { margin: "12px 20px 0", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  bannerOk: { backgroundColor: "#dcfce7", color: "#15803d" },
  bannerErr: { backgroundColor: "#fee2e2", color: "#991b1b" },
  bannerClose: { background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "inherit", padding: "0 4px" },
  filtros: { display: "flex", gap: "8px", padding: "12px 20px", backgroundColor: "#fff", borderBottom: "0.5px solid #e5e7eb" },
  filtroBtn: { padding: "5px 14px", borderRadius: "99px", border: "0.5px solid #d1d5db", fontSize: "12px", cursor: "pointer", background: "#fff", color: "#374151", fontFamily: "Inter, sans-serif" },
  filtroBtnActivo: { backgroundColor: "#185FA5", color: "#fff", border: "0.5px solid #185FA5", fontWeight: "600" },
  list: { padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" },
  tareaCard: { backgroundColor: "#fff", borderRadius: "12px", border: "0.5px solid #e5e7eb", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" },
  tareaLeft: { flex: 1 },
  tareaTitulo: { fontSize: "13px", fontWeight: "600", color: "#111827" },
  tareaCurso: { fontSize: "11px", color: "#185FA5", marginTop: "2px" },
  tareaDesc: { fontSize: "11px", color: "#6b7280", marginTop: "4px", lineHeight: "1.4" },
  entregaComentario: { fontSize: "11px", color: "#059669", marginTop: "6px", fontStyle: "italic" },
  calificacion: { fontSize: "12px", fontWeight: "600", color: "#7c3aed", marginTop: "4px" },
  estadoBadge: { fontSize: "10px", padding: "2px 8px", borderRadius: "99px", fontWeight: "600", textTransform: "capitalize" },
  tareaRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 },
  dias: { fontSize: "11px", fontWeight: "500" },
  puntos: { fontSize: "11px", color: "#6b7280" },
  btnEntregar: { padding: "6px 14px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  emptyState: { textAlign: "center", padding: "3rem 0" },
  btnPrimary: { padding: "8px 18px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  btnSec: { padding: "8px 18px", backgroundColor: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
};