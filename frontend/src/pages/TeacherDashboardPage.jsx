import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function TeacherDashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vista, setVista] = useState("lista"); // "lista" | "crear" | "editar"
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState("");

  // Formulario de curso
  const [form, setForm] = useState({ titulo: "", descripcion: "", imagen: "" });

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cursos");
      setCursos(res.data);
    } catch {
      setError("No se pudieron cargar los cursos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const abrirCrear = () => {
    setForm({ titulo: "", descripcion: "", imagen: "" });
    setCursoSeleccionado(null);
    setExito("");
    setError("");
    setVista("crear");
  };

  const abrirEditar = (curso) => {
    setForm({ titulo: curso.titulo, descripcion: curso.descripcion || "", imagen: curso.imagen || "" });
    setCursoSeleccionado(curso);
    setExito("");
    setError("");
    setVista("editar");
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      if (vista === "crear") {
        await api.post("/cursos", form);
        setExito("Curso creado correctamente ✅");
      } else {
        await api.put(`/cursos/${cursoSeleccionado._id}`, form);
        setExito("Curso actualizado correctamente ✅");
      }
      await cargarCursos();
      setTimeout(() => {
        setExito("");
        setVista("lista");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el curso.");
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    setVista("lista");
    setError("");
    setExito("");
  };

  const handleEliminar = async (curso) => {
    const confirmar = window.confirm(`¿Eliminar el curso "${curso.titulo}"? Esta acción lo desactivará.`);
    if (!confirmar) return;
    try {
      await api.delete(`/cursos/${curso._id}`);
      await cargarCursos();
    } catch (err) {
      alert("Error al eliminar el curso.");
    }
  };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarTop}>
          <div style={s.logoCircle}>🎓</div>
          <span style={s.logoText}>AulaVirtual Pro</span>
        </div>
        <nav style={s.nav}>
          <button style={{ ...s.navItem, ...(vista === "lista" ? s.navActive : {}) }} onClick={() => setVista("lista")}>
            📚 Mis Cursos
          </button>
          <button style={s.navItem} onClick={abrirCrear}>
            ➕ Nuevo Curso
          </button>
        </nav>
        <div style={s.sidebarBottom}>
          <div style={s.userInfo}>
            <div style={s.avatar}>{usuario ? usuario[0].toUpperCase() : "P"}</div>
            <div>
              <p style={s.userName}>{usuario || "Profesor"}</p>
              <p style={s.userRole}>Instructor</p>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.headerTitle}>
              {vista === "lista" && "Mis Cursos"}
              {vista === "crear" && "Crear Nuevo Curso"}
              {vista === "editar" && "Editar Curso"}
            </h1>
            <p style={s.headerSub}>
              {vista === "lista" && `${cursos.length} curso(s) disponibles`}
              {vista === "crear" && "Completa los datos del nuevo curso"}
              {vista === "editar" && `Editando: ${cursoSeleccionado?.titulo}`}
            </p>
          </div>
          {vista === "lista" && (
            <button style={s.btnPrimary} onClick={abrirCrear}>+ Nuevo Curso</button>
          )}
        </div>

        {/* Vista: Lista de cursos */}
        {vista === "lista" && (
          <>
            {loading && <p style={s.info}>Cargando cursos...</p>}
            {error && <p style={s.errorMsg}>{error}</p>}
            {!loading && cursos.length === 0 && (
              <div style={s.emptyState}>
                <p style={s.emptyIcon}>📖</p>
                <p style={s.emptyText}>Aún no hay cursos. ¡Crea el primero!</p>
                <button style={s.btnPrimary} onClick={abrirCrear}>Crear Curso</button>
              </div>
            )}
            <div style={s.grid}>
              {cursos.map((curso) => (
                <div key={curso._id} style={s.card}>
                  <div style={s.cardImgWrap}>
                    {curso.imagen
                      ? <img src={curso.imagen} alt={curso.titulo} style={s.cardImg} onError={(e) => { e.target.style.display = "none"; }} />
                      : <div style={s.cardImgPlaceholder}>📚</div>
                    }
                  </div>
                  <div style={s.cardBody}>
                    <h3 style={s.cardTitle}>{curso.titulo}</h3>
                    <p style={s.cardDesc}>{curso.descripcion || "Sin descripción"}</p>
                    <div style={s.cardMeta}>
                      <span style={s.badge}>{curso.modulos?.length || 0} módulos</span>
                      <span style={{ ...s.badge, backgroundColor: curso.activo ? "#dcfce7" : "#fee2e2", color: curso.activo ? "#166534" : "#991b1b" }}>
                        {curso.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={s.btnEdit} onClick={() => abrirEditar(curso)}>✏️ Editar</button>
                      <button style={{ ...s.btnEdit, backgroundColor: "#fff", color: "#dc2626", border: "1px solid #dc2626" }} onClick={() => handleEliminar(curso)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Vista: Crear / Editar */}
        {(vista === "crear" || vista === "editar") && (
          <div style={s.formWrap}>
            <form onSubmit={handleGuardar} style={s.form}>
              <div style={s.formField}>
                <label style={s.formLabel}>Título del curso *</label>
                <input
                  type="text"
                  placeholder="Ej. Introducción a React"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  style={s.formInput}
                />
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>Descripción</label>
                <textarea
                  placeholder="Describe el contenido del curso..."
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  style={{ ...s.formInput, minHeight: "100px", resize: "vertical" }}
                />
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>URL de imagen de portada</label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={form.imagen}
                  onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  style={s.formInput}
                />
                {form.imagen && (
                  <img src={form.imagen} alt="preview" style={s.imgPreview}
                    onError={(e) => e.target.style.display = "none"} />
                )}
              </div>

              {error && <p style={s.errorMsg}>{error}</p>}
              {exito && <p style={s.successMsg}>{exito}</p>}

              <div style={s.formActions}>
                <button type="button" style={s.btnSecondary} onClick={handleCancelar}>
                  Cancelar
                </button>
                <button type="submit" style={s.btnPrimary} disabled={guardando}>
                  {guardando ? "Guardando..." : vista === "crear" ? "Crear Curso" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#f0f4f8",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#1a3a5c",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    flexShrink: 0,
  },
  sidebarTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "24px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logoCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#2a5a8c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  logoText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 12px",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    background: "none",
    border: "none",
    color: "#93c5fd",
    textAlign: "left",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  navActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontWeight: "600",
  },
  sidebarBottom: {
    padding: "16px 12px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#185FA5",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },
  userName: { color: "#fff", fontSize: "13px", fontWeight: "600", margin: 0 },
  userRole: { color: "#93c5fd", fontSize: "11px", margin: 0 },
  logoutBtn: {
    width: "100%",
    padding: "8px",
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#93c5fd",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  main: {
    flex: 1,
    padding: "32px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  headerSub: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
    marginBottom: 0,
  },
  btnPrimary: {
    padding: "10px 20px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  btnSecondary: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  btnEdit: {
    marginTop: "12px",
    flex: 1,
    padding: "8px",
    backgroundColor: "#f0f4f8",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#374151",
    fontFamily: "Inter, sans-serif",
  },
  info: { color: "#6b7280", fontSize: "14px" },
  errorMsg: { color: "#DC2626", fontSize: "13px", marginBottom: "12px" },
  successMsg: { color: "#16a34a", fontSize: "13px", marginBottom: "12px" },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  emptyIcon: { fontSize: "48px", margin: "0 0 12px" },
  emptyText: { color: "#6b7280", fontSize: "15px", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  cardImgWrap: {
    height: "140px",
    backgroundColor: "#e0e7ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardImg: { width: "100%", height: "100%", objectFit: "cover" },
  cardImgPlaceholder: { fontSize: "48px" },
  cardBody: { padding: "16px", display: "flex", flexDirection: "column" },
  cardTitle: { fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 6px" },
  cardDesc: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 10px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardMeta: { display: "flex", gap: "6px", flexWrap: "wrap" },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 8px",
    borderRadius: "20px",
    backgroundColor: "#e0e7ef",
    color: "#374151",
  },
  formWrap: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    padding: "32px",
    maxWidth: "600px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  formField: { display: "flex", flexDirection: "column", gap: "6px" },
  formLabel: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  formInput: {
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    color: "#111827",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
  },
  imgPreview: {
    marginTop: "8px",
    width: "100%",
    maxHeight: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  formActions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
};