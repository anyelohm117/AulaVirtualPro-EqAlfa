import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";
import MaterialDownload from "../components/MaterialDownload";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [progreso, setProgreso] = useState({ leccionesCompletadas: [], porcentaje: 0 });
  const [loading, setLoading] = useState(true);
  const [modulosAbiertos, setModulosAbiertos] = useState({});
  const [leccionActiva, setLeccionActiva] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resCurso = await api.get(`/cursos/${id}`);
        setCurso(resCurso.data);

        if (resCurso.data.modulos?.length > 0) {
          setModulosAbiertos({ [resCurso.data.modulos[0]._id]: true });
          setLeccionActiva(resCurso.data.modulos[0].lecciones[0]);
        }

        try {
          const resProgreso = await api.get(`/progreso/${id}`);
          setProgreso(resProgreso.data);
        } catch {
          setProgreso({ leccionesCompletadas: [], porcentaje: 0 });
        }
      } catch (err) {
        console.error("Error al cargar curso:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  if (loading) return <p style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>Cargando curso...</p>;
  if (!curso) return <p style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>Curso no encontrado.</p>;

  const todasLecciones = curso.modulos.flatMap((m) => m.lecciones);
  const indexActual = todasLecciones.findIndex((l) => l._id === leccionActiva?._id);
  const totalLecciones = todasLecciones.length;

  const estaCompletada = (leccionId) =>
    progreso.leccionesCompletadas?.includes(leccionId);

  const toggleModulo = (moduloId) => {
    setModulosAbiertos((prev) => ({ ...prev, [moduloId]: !prev[moduloId] }));
  };

  const irAnterior = () => {
    if (indexActual > 0) setLeccionActiva(todasLecciones[indexActual - 1]);
  };

  const irSiguiente = () => {
    if (indexActual < totalLecciones - 1) {
      setLeccionActiva(todasLecciones[indexActual + 1]);
    } else {
      navigate(`/quiz/${id}`);
    }
  };

  const handleLeccionCompletada = (leccionId) => {
    setProgreso((prev) => ({
      ...prev,
      leccionesCompletadas: [...(prev.leccionesCompletadas || []), leccionId],
    }));
  };

  const pctProgreso = Math.round(
    ((progreso.leccionesCompletadas?.length || 0) / totalLecciones) * 100
  );

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sideHeader}>
          <button
            onClick={() => navigate("/catalog")}
            style={{ fontSize: "11px", color: "#185FA5", background: "none", border: "none", cursor: "pointer", marginBottom: "8px", padding: 0, fontFamily: "Inter, sans-serif", fontWeight: "600" }}
          >
            ← Volver al catálogo
          </button>
          <h3 style={styles.sideTitle}>{curso.titulo}</h3>
        </div>

        <div style={styles.sideProgress}>
          <ProgressBar value={pctProgreso} height={4} showLabel={false} />
          <span style={styles.progTxt}>
            {progreso.leccionesCompletadas?.length || 0} / {totalLecciones} lecciones · {pctProgreso}%
          </span>
        </div>

        {curso.modulos.map((modulo) => (
          <div key={modulo._id} style={styles.modulo}>
            <div style={styles.moduloHeader} onClick={() => toggleModulo(modulo._id)}>
              <span>{modulo.titulo}</span>
              <span style={styles.chevron}>{modulosAbiertos[modulo._id] ? "▾" : "▸"}</span>
            </div>

            {modulosAbiertos[modulo._id] &&
              modulo.lecciones.map((leccion) => (
                <div
                  key={leccion._id}
                  style={{
                    ...styles.leccion,
                    ...(leccionActiva?._id === leccion._id ? styles.leccionActiva : {}),
                  }}
                  onClick={() => setLeccionActiva(leccion)}
                >
                  <span style={{
                    ...styles.playIcon,
                    color: estaCompletada(leccion._id) ? "#15803d" : (leccionActiva?._id === leccion._id ? "#185FA5" : "#9ca3af"),
                  }}>
                    {estaCompletada(leccion._id) ? "✓" : "▶"}
                  </span>
                  {leccion.titulo}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>{leccionActiva?.titulo}</h2>
          <span style={styles.topCount}>{indexActual + 1} / {totalLecciones}</span>
        </div>

        <div style={styles.content}>
          <LessonViewer
            key={leccionActiva?._id}
            leccion={{ ...leccionActiva, id: leccionActiva?._id, completada: estaCompletada(leccionActiva?._id) }}
            cursoId={id}
            onCompletada={handleLeccionCompletada}
          />
          <div style={styles.materialesWrap}>
            <MaterialDownload leccionId={leccionActiva?._id} cursoId={id} />
          </div>
        </div>

        <div style={styles.footer}>
          <button style={{ ...styles.btnNav, ...styles.btnPrev }} onClick={irAnterior} disabled={indexActual === 0}>
            ← Anterior
          </button>
          <button style={{ ...styles.btnNav, ...styles.btnNext }} onClick={irSiguiente}>
            {indexActual === totalLecciones - 1 ? "Ir al quiz →" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "Inter, sans-serif", backgroundColor: "#fff" },
  sidebar: { width: "240px", borderRight: "0.5px solid #e5e7eb", display: "flex", flexDirection: "column", backgroundColor: "#fff", flexShrink: 0 },
  sideHeader: { padding: "14px 16px", borderBottom: "0.5px solid #e5e7eb" },
  sideTitle: { fontSize: "13px", fontWeight: "600", color: "#111827", lineHeight: "1.4" },
  sideProgress: { padding: "10px 16px", borderBottom: "0.5px solid #e5e7eb", display: "flex", flexDirection: "column", gap: "6px" },
  progTxt: { fontSize: "11px", color: "#185FA5" },
  modulo: { borderBottom: "0.5px solid #e5e7eb" },
  moduloHeader: { padding: "10px 16px", fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" },
  chevron: { fontSize: "10px", color: "#6b7280" },
  leccion: { padding: "8px 16px 8px 28px", fontSize: "11px", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", lineHeight: "1.4" },
  leccionActiva: { color: "#185FA5", backgroundColor: "#E6F1FB" },
  playIcon: { fontSize: "9px", flexShrink: 0 },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  topTitle: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  topCount: { fontSize: "12px", color: "#6b7280" },
  content: { flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" },
  materialesWrap: { marginTop: "4px" },
  footer: { padding: "14px 20px", borderTop: "0.5px solid #e5e7eb", display: "flex", justifyContent: "space-between" },
  btnNav: { padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
  btnPrev: { backgroundColor: "#fff", color: "#185FA5", border: "0.5px solid #185FA5" },
  btnNext: { backgroundColor: "#185FA5", color: "#fff", border: "none" },
};