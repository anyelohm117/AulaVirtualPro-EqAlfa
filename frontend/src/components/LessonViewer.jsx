import { useState } from "react";
import api from "../services/api";

/**
 * LessonViewer.jsx
 * Uso: <LessonViewer leccion={leccion} cursoId={id} onCompletada={callback} />
 * Props:
 *   leccion       objeto { id, titulo, contenido, videoUrl? }
 *   cursoId       string/number del curso actual (para la llamada a la API)
 *   onCompletada  función que se llama cuando el alumno marca la lección como completada
 */
export default function LessonViewer({ leccion, cursoId, onCompletada }) {
  const [completada, setCompletada] = useState(leccion?.completada || false);
  const [loading, setLoading] = useState(false);

  if (!leccion) return null;

  const handleCompletar = async () => {
    if (completada || loading) return;
    setLoading(true);
    try {
      await api.post(`/progreso/cursos/${cursoId}/lecciones/${leccion.id}/completar`);
      setCompletada(true);
      if (onCompletada) onCompletada(leccion.id);
    } catch (err) {
      console.error("Error al marcar lección como completada:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      {leccion.videoUrl ? (
        <div style={styles.videoWrap}>
          <iframe
            src={leccion.videoUrl}
            title={leccion.titulo}
            style={styles.iframe}
            allowFullScreen
          />
        </div>
      ) : (
        <div style={styles.videoPlaceholder}>
          <div style={styles.playCircle}>
            <span style={styles.playIcon}>▶</span>
          </div>
          <p style={styles.placeholderTxt}>Video no disponible</p>
        </div>
      )}

      <div style={styles.body}>
        <h3 style={styles.titulo}>{leccion.titulo}</h3>
        <p style={styles.contenido}>{leccion.contenido}</p>
      </div>

      <div style={styles.footer}>
        {completada ? (
          <div style={styles.completadaBadge}>
            <span style={styles.checkIcon}>✓</span>
            Lección completada
          </div>
        ) : (
          <button
            style={{
              ...styles.btnCompletar,
              ...(loading ? styles.btnLoading : {}),
            }}
            onClick={handleCompletar}
            disabled={loading}
          >
            {loading ? "Guardando..." : "✓ Marcar como completada"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "Inter, sans-serif",
  },
  videoWrap: {
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: "12px",
    overflow: "hidden",
    border: "0.5px solid #e5e7eb",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  videoPlaceholder: {
    height: "220px",
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    border: "0.5px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  playCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: "20px",
    color: "#9ca3af",
    marginLeft: "4px",
  },
  placeholderTxt: {
    fontSize: "13px",
    color: "#9ca3af",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  titulo: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#111827",
    lineHeight: "1.4",
  },
  contenido: {
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.75",
  },
  footer: {
    paddingTop: "4px",
  },
  btnCompletar: {
    padding: "10px 20px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    transition: "opacity 0.15s",
  },
  btnLoading: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  completadaBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
  },
  checkIcon: {
    fontSize: "14px",
  },
};
