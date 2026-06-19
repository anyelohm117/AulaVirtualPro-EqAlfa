import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";
import MaterialDownload from "../components/MaterialDownload";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modulosAbiertos, setModulosAbiertos] = useState({});
  const [leccionActivaId, setLeccionActivaId] = useState(null);
  const [leccionesCompletadas, setLeccionesCompletadas] = useState([]);

  useEffect(() => {
    const cargarCurso = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/cursos/${id}`);
        setCurso(res.data);
        if (res.data.modulos?.length > 0) {
          setModulosAbiertos({ [res.data.modulos[0]._id]: true });
          if (res.data.modulos[0].lecciones?.length > 0) {
            setLeccionActivaId(res.data.modulos[0].lecciones[0]._id);
          }
        }
        // Intentar traer el progreso ya guardado del alumno
        try {
          const prog = await api.get(`/progreso/${id}`);
          setLeccionesCompletadas(prog.data.leccionesCompletadas || []);
        } catch {
          // si falla (p. ej. rol no es alumno), seguimos sin progreso
        }
      } catch (err) {
        setError("No se pudo cargar el curso.");
      } finally {
        setLoading(false);
      }
    };
    cargarCurso();
  }, [id]);

  const todasLecciones = useMemo(
    () => (curso?.modulos || []).flatMap((m) => m.lecciones),
    [curso]
  );

  const leccionActiva = todasLecciones.find((l) => l._id === leccionActivaId);
  const indexActual = todasLecciones.findIndex((l) => l._id === leccionActivaId);
  const totalLecciones = todasLecciones.length;
  const completadasCount = leccionesCompletadas.length;
  const pctProgreso = totalLecciones > 0
    ? Math.round((completadasCount / totalLecciones) * 100)
    : 0;

  const toggleModulo = (moduloId) => {
    setModulosAbiertos((prev) => ({ ...prev, [moduloId]: !prev[moduloId] }));
  };

  const irAnterior = () => {
    if (indexActual > 0) setLeccionActivaId(todasLecciones[indexActual - 1]._id);
  };

  const irSiguiente = () => {
    if (indexActual < todasLecciones.length - 1) {
      setLeccionActivaId(todasLecciones[indexActual + 1]._id);
    } else {
      navigate(`/quiz/${id}`);
    }
  };

  const handleLeccionCompletada = (leccionId) => {
    setLeccionesCompletadas((prev) =>
      prev.includes(leccionId) ? prev : [...prev, leccionId]
    );
  };

  if (loading) {
    return <div style={styles.centerMsg}>Cargando curso...</div>;
  }

  if (error || !curso) {
    return <div style={{ ...styles.centerMsg, color: "#dc2626" }}>{error || "Curso no encontrado."}</div>;
  }

  if (totalLecciones === 0) {
    return (
      <div style={styles.centerMsg}>
        <p>Este curso aún no tiene lecciones.</p>
        <button style={styles.btnVolverSimple} onClick={() => navigate("/catalog")}>← Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ── Sidebar ── */}
      <div style={styles.sidebar}>
        <div style={styles.sideHeader}>
          <h3 style={styles.sideTitle}>{curso.titulo}</h3>
        </div>

        <div style={styles.sideProgress}>
          <ProgressBar
            value={pctProgreso}
            height={4}
            showLabel={false}
          />
          <span style={styles.progTxt}>
            {completadasCount} / {totalLecciones} lecciones · {pctProgreso}%
          </span>
        </div>

        {curso.modulos.map((modulo) => (
          <div key={modulo._id} style={styles.modulo}>
            <div
              style={styles.moduloHeader}
              onClick={() => toggleModulo(modulo._id)}
            >
              <span>{modulo.titulo}</span>
              <span style={styles.chevron}>
                {modulosAbiertos[modulo._id] ? "▾" : "▸"}
              </span>
            </div>

            {modulosAbiertos[modulo._id] &&
              modulo.lecciones.map((leccion) => {
                const completada = leccionesCompletadas.includes(leccion._id);
                return (
                  <div
                    key={leccion._id}
                    style={{
                      ...styles.leccion,
                      ...(leccionActivaId === leccion._id ? styles.leccionActiva : {}),
                    }}
                    onClick={() => setLeccionActivaId(leccion._id)}
                  >
                    <span style={{
                      ...styles.playIcon,
                      color: completada ? "#15803d" : (leccionActivaId === leccion._id ? "#185FA5" : "#9ca3af"),
                    }}>
                      {completada ? "✓" : "▶"}
                    </span>
                    {leccion.titulo}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* ── Contenido principal ── */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>{leccionActiva?.titulo}</h2>
          <span style={styles.topCount}>
            {indexActual + 1} / {todasLecciones.length}
          </span>
        </div>

        <div style={styles.content}>
          {/* Visor de lección */}
          <LessonViewer
            leccion={{
              ...leccionActiva,
              id: leccionActiva?._id,
              completada: leccionesCompletadas.includes(leccionActiva?._id),
            }}
            cursoId={id}
            onCompletada={handleLeccionCompletada}
          />

          {/* Materiales descargables */}
          <div style={styles.materialesWrap}>
            <MaterialDownload leccionId={leccionActiva?._id} cursoId={id} />
          </div>
        </div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.btnNav, ...styles.btnPrev }}
            onClick={irAnterior}
            disabled={indexActual === 0}
          >
            ← Anterior
          </button>
          <button
            style={{ ...styles.btnNav, ...styles.btnNext }}
            onClick={irSiguiente}
          >
            {indexActual === todasLecciones.length - 1 ? "Ir al quiz →" : "Siguiente →"}
          </button>
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
    backgroundColor: "#fff",
  },
  centerMsg: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    color: "#6b7280",
    fontSize: "14px",
  },
  btnVolverSimple: {
    padding: "8px 18px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: "240px",
    borderRight: "0.5px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    flexShrink: 0,
  },
  sideHeader: {
    padding: "14px 16px",
    borderBottom: "0.5px solid #e5e7eb",
  },
  sideTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    lineHeight: "1.4",
  },
  sideProgress: {
    padding: "10px 16px",
    borderBottom: "0.5px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  progTxt: {
    fontSize: "11px",
    color: "#185FA5",
  },
  modulo: {
    borderBottom: "0.5px solid #e5e7eb",
  },
  moduloHeader: {
    padding: "10px 16px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#111827",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    userSelect: "none",
  },
  chevron: {
    fontSize: "10px",
    color: "#6b7280",
  },
  leccion: {
    padding: "8px 16px 8px 28px",
    fontSize: "11px",
    color: "#6b7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    lineHeight: "1.4",
  },
  leccionActiva: {
    color: "#185FA5",
    backgroundColor: "#E6F1FB",
  },
  playIcon: {
    fontSize: "9px",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topbar: {
    padding: "14px 20px",
    borderBottom: "0.5px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
  },
  topCount: {
    fontSize: "12px",
    color: "#6b7280",
  },
  content: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
  },
  materialesWrap: {
    marginTop: "4px",
  },
  footer: {
    padding: "14px 20px",
    borderTop: "0.5px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
  },
  btnNav: {
    padding: "8px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  btnPrev: {
    backgroundColor: "#fff",
    color: "#185FA5",
    border: "0.5px solid #185FA5",
  },
  btnNext: {
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
  },
};
