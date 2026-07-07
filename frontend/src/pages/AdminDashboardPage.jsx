import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AdminDashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState("usuarios");
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formNuevo, setFormNuevo] = useState({ nombre: "", email: "", password: "", rol: "instructor" });
  const [errorForm, setErrorForm] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resUsuarios, resCursos, resReporte] = await Promise.all([
        api.get("/usuarios"),
        api.get("/cursos"),
        api.get("/reportes/admin"),
      ]);
      setUsuarios(resUsuarios.data);
      setCursos(resCursos.data);
      setReporte(resReporte.data);
    } catch (err) {
      console.error("Error al cargar datos del admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleToggleEstado = async (id) => {
    try {
      await api.patch(`/usuarios/${id}/estado`);
      await cargarDatos();
    } catch { alert("Error al cambiar estado del usuario."); }
  };

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Eliminar este usuario permanentemente?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      await cargarDatos();
    } catch { alert("Error al eliminar usuario."); }
  };

  const handleEliminarCurso = async (id) => {
    if (!window.confirm("¿Desactivar este curso?")) return;
    try {
      await api.delete(`/cursos/${id}`);
      await cargarDatos();
    } catch { alert("Error al eliminar curso."); }
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setErrorForm("");
    if (!formNuevo.nombre || !formNuevo.email || !formNuevo.password) {
      setErrorForm("Todos los campos son obligatorios.");
      return;
    }
    setGuardando(true);
    try {
      await api.post("/usuarios", formNuevo);
      setModalAbierto(false);
      setFormNuevo({ nombre: "", email: "", password: "", rol: "instructor" });
      await cargarDatos();
    } catch (err) {
      setErrorForm(err.response?.data?.error || "Error al crear usuario.");
    } finally {
      setGuardando(false);
    }
  };

  // Stats calculadas desde datos reales
  const totalAlumnos = usuarios.filter(u => u.rol === "alumno").length;
  const totalInstructores = usuarios.filter(u => u.rol === "instructor").length;
  const cursosActivos = cursos.filter(c => c.activo).length;
  const tasaAprobacion = reporte.length
    ? Math.round(reporte.flatMap(a => a.calificaciones).filter(c => c.aprobado).length /
        Math.max(reporte.flatMap(a => a.calificaciones).length, 1) * 100)
    : 0;

  return (
    <div style={s.page}>
      {/* Modal nuevo usuario */}
      {modalAbierto && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>Nuevo usuario</h3>
              <button style={s.closeBtn} onClick={() => setModalAbierto(false)}>✕</button>
            </div>
            <form onSubmit={handleCrearUsuario} style={s.modalForm}>
              <div style={s.field}>
                <label style={s.label}>Nombre completo</label>
                <input style={s.input} placeholder="Nombre" value={formNuevo.nombre}
                  onChange={e => setFormNuevo({...formNuevo, nombre: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" placeholder="correo@ejemplo.com" value={formNuevo.email}
                  onChange={e => setFormNuevo({...formNuevo, email: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Contraseña temporal</label>
                <input style={s.input} type="password" placeholder="Mínimo 6 caracteres" value={formNuevo.password}
                  onChange={e => setFormNuevo({...formNuevo, password: e.target.value})} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Rol</label>
                <select style={s.input} value={formNuevo.rol}
                  onChange={e => setFormNuevo({...formNuevo, rol: e.target.value})}>
                  <option value="alumno">Alumno</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {errorForm && <p style={s.errorMsg}>{errorForm}</p>}
              <div style={s.modalActions}>
                <button type="button" style={s.btnSec} onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" style={s.btnPrimary} disabled={guardando}>
                  {guardando ? "Creando..." : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={s.card}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.topLeft}>
            <h2 style={s.topTitle}>Panel de administración</h2>
            <span style={s.badgeAdmin}>Admin</span>
          </div>
          <div style={s.topRight}>
            <span style={s.adminName}>{usuario || "Administrador"}</span>
            <button style={s.btnLogout} onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>

        {/* Stats reales */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <p style={s.statLabel}>Total alumnos</p>
            <p style={s.statVal}>{totalAlumnos}</p>
            <p style={s.statSub}>{totalInstructores} instructores</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Cursos activos</p>
            <p style={s.statVal}>{cursosActivos}</p>
            <p style={s.statSub}>{cursos.length - cursosActivos} inactivos</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Total usuarios</p>
            <p style={s.statVal}>{usuarios.length}</p>
            <p style={s.statSub}>en el sistema</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Tasa de aprobación</p>
            <p style={s.statVal}>{tasaAprobacion}%</p>
            <p style={s.statSub}>promedio general</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {["usuarios","cursos","reportes"].map(tab => (
            <button key={tab} style={{...s.tab, ...(tabActiva===tab ? s.tabActiva : {})}}
              onClick={() => setTabActiva(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={s.loadingMsg}>Cargando datos...</p>
        ) : (
          <>
            {/* Tab Usuarios */}
            {tabActiva === "usuarios" && (
              <div style={s.section}>
                <div style={s.sectionHeader}>
                  <h3 style={s.sectionTitle}>Usuarios registrados ({usuarios.length})</h3>
                  <button style={s.btnAdd} onClick={() => setModalAbierto(true)}>+ Nuevo usuario</button>
                </div>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nombre</th>
                      <th style={s.th}>Email</th>
                      <th style={s.th}>Rol</th>
                      <th style={s.th}>Estado</th>
                      <th style={s.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u._id}>
                        <td style={s.td}>{u.nombre}</td>
                        <td style={s.td}>{u.email}</td>
                        <td style={s.td}>
                          <span style={{...s.badge,
                            backgroundColor: u.rol==="admin" ? "#FAECE7" : u.rol==="instructor" ? "#E6F1FB" : "#f3f4f6",
                            color: u.rol==="admin" ? "#712B13" : u.rol==="instructor" ? "#185FA5" : "#374151",
                          }}>{u.rol}</span>
                        </td>
                        <td style={s.td}>
                          <span style={{...s.badge,
                            backgroundColor: u.activo ? "#dcfce7" : "#fef9c3",
                            color: u.activo ? "#15803d" : "#854d0e",
                          }}>{u.activo ? "Activo" : "Inactivo"}</span>
                        </td>
                        <td style={s.td}>
                          <button style={s.actionBtn} title={u.activo ? "Desactivar" : "Activar"}
                            onClick={() => handleToggleEstado(u._id)}>
                            {u.activo ? "🔒" : "🔓"}
                          </button>
                          <button style={s.actionBtn} title="Eliminar"
                            onClick={() => handleEliminarUsuario(u._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab Cursos */}
            {tabActiva === "cursos" && (
              <div style={s.section}>
                <div style={s.sectionHeader}>
                  <h3 style={s.sectionTitle}>Cursos registrados ({cursos.length})</h3>
                </div>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Título</th>
                      <th style={s.th}>Módulos</th>
                      <th style={s.th}>Estado</th>
                      <th style={s.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map(c => (
                      <tr key={c._id}>
                        <td style={s.td}>{c.titulo}</td>
                        <td style={s.td}>{c.modulos?.length || 0}</td>
                        <td style={s.td}>
                          <span style={{...s.badge,
                            backgroundColor: c.activo ? "#dcfce7" : "#fee2e2",
                            color: c.activo ? "#15803d" : "#991b1b",
                          }}>{c.activo ? "Activo" : "Inactivo"}</span>
                        </td>
                        <td style={s.td}>
                          <button style={s.actionBtn} title="Eliminar"
                            onClick={() => handleEliminarCurso(c._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab Reportes */}
            {tabActiva === "reportes" && (
              <div style={s.section}>
                <div style={s.sectionHeader}>
                  <h3 style={s.sectionTitle}>Reporte de progreso por alumno</h3>
                </div>
                {reporte.length === 0 ? (
                  <p style={s.emptyMsg}>No hay datos de progreso aún.</p>
                ) : (
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Alumno</th>
                        <th style={s.th}>Email</th>
                        <th style={s.th}>Cursos en progreso</th>
                        <th style={s.th}>Quizzes realizados</th>
                        <th style={s.th}>Aprobados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporte.map(r => (
                        <tr key={r.alumno.id}>
                          <td style={s.td}>{r.alumno.nombre}</td>
                          <td style={s.td}>{r.alumno.email}</td>
                          <td style={s.td}>{r.progresos.length}</td>
                          <td style={s.td}>{r.calificaciones.length}</td>
                          <td style={s.td}>
                            <span style={{...s.badge,
                              backgroundColor: r.calificaciones.filter(c=>c.aprobado).length > 0 ? "#dcfce7" : "#f3f4f6",
                              color: r.calificaciones.filter(c=>c.aprobado).length > 0 ? "#15803d" : "#6b7280",
                            }}>
                              {r.calificaciones.filter(c=>c.aprobado).length} / {r.calificaciones.length}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "Inter, sans-serif", padding: "2rem" },
  card: { backgroundColor: "#fff", borderRadius: "16px", border: "0.5px solid #e5e7eb", overflow: "hidden", maxWidth: "1000px", margin: "0 auto" },
  topbar: { padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  topLeft: { display: "flex", alignItems: "center", gap: "10px" },
  topTitle: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  badgeAdmin: { backgroundColor: "#E6F1FB", color: "#185FA5", fontSize: "11px", padding: "3px 10px", borderRadius: "99px", fontWeight: "600" },
  topRight: { display: "flex", alignItems: "center", gap: "12px" },
  adminName: { fontSize: "13px", color: "#6b7280" },
  btnLogout: { padding: "6px 14px", backgroundColor: "#fff", color: "#dc2626", border: "0.5px solid #dc2626", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", padding: "16px 20px", borderBottom: "0.5px solid #e5e7eb" },
  statCard: { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "14px" },
  statLabel: { fontSize: "11px", color: "#6b7280", marginBottom: "6px" },
  statVal: { fontSize: "24px", fontWeight: "600", color: "#111827" },
  statSub: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },
  tabs: { display: "flex", borderBottom: "0.5px solid #e5e7eb", padding: "0 20px" },
  tab: { padding: "10px 16px", fontSize: "13px", fontWeight: "500", color: "#6b7280", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  tabActiva: { color: "#185FA5", borderBottom: "2px solid #185FA5" },
  section: { padding: "16px 20px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  sectionTitle: { fontSize: "13px", fontWeight: "600", color: "#111827" },
  btnAdd: { padding: "6px 14px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
  th: { textAlign: "left", padding: "6px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", borderBottom: "0.5px solid #e5e7eb" },
  td: { padding: "8px", color: "#111827", borderBottom: "0.5px solid #e5e7eb" },
  badge: { display: "inline-block", padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" },
  actionBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "2px 6px", borderRadius: "4px" },
  loadingMsg: { padding: "2rem", textAlign: "center", fontSize: "13px", color: "#6b7280" },
  emptyMsg: { fontSize: "12px", color: "#9ca3af", textAlign: "center", padding: "2rem" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { backgroundColor: "#fff", borderRadius: "12px", width: "100%", maxWidth: "420px", padding: "0", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" },
  modalHead: { padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#6b7280" },
  modalForm: { padding: "20px", display: "flex", flexDirection: "column", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", fontWeight: "500", color: "#374151" },
  input: { padding: "9px 12px", fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", fontFamily: "Inter, sans-serif", color: "#111827", backgroundColor: "#fff" },
  errorMsg: { fontSize: "12px", color: "#dc2626", textAlign: "center" },
  modalActions: { display: "flex", gap: "10px", justifyContent: "flex-end" },
  btnPrimary: { padding: "8px 18px", backgroundColor: "#185FA5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  btnSec: { padding: "8px 18px", backgroundColor: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
};