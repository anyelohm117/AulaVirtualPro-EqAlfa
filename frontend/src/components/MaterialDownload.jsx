import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * MaterialDownload.jsx
 * Uso: <MaterialDownload leccionId={3} cursoId={1} />
 * Props:
 *   leccionId   ID de la lección actual
 *   cursoId     ID del curso actual
 *
 * La API esperada:
 *   GET /cursos/:cursoId/lecciones/:leccionId/materiales
 *   Responde: [{ id, nombre, tipo, url, tamaño }]
 *   Tipos soportados: pdf, video, zip, imagen, otro
 */

const ICONOS_TIPO = {
  pdf: { emoji: "📄", color: "#dc2626", bg: "#fee2e2" },
  video: { emoji: "🎬", color: "#7c3aed", bg: "#ede9fe" },
  zip: { emoji: "🗜️", color: "#b45309", bg: "#fef3c7" },
  imagen: { emoji: "🖼️", color: "#0369a1", bg: "#e0f2fe" },
  otro: { emoji: "📎", color: "#4b5563", bg: "#f3f4f6" },
};

// Datos mock para desarrollo — reemplazar con llamada real a la API
const MOCK_MATERIALES = [
  { id: 1, nombre: "Slides de la lección.pdf", tipo: "pdf", url: "#", tamaño: "1.2 MB" },
  { id: 2, nombre: "Ejercicios prácticos.zip", tipo: "zip", url: "#", tamaño: "840 KB" },
  { id: 3, nombre: "Lectura complementaria.pdf", tipo: "pdf", url: "#", tamaño: "320 KB" },
];

export default function MaterialDownload({ leccionId, cursoId }) {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leccionId || !cursoId) return;

    const fetchMateriales = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(
          `/cursos/${cursoId}/lecciones/${leccionId}/materiales`
        );
        setMateriales(res.data);
      } catch (err) {
        // Mientras no exista el endpoint, usamos los mock
        console.warn("API no disponible, usando datos mock:", err.message);
        setMateriales(MOCK_MATERIALES);
      } finally {
        setLoading(false);
      }
    };

    fetchMateriales();
  }, [leccionId, cursoId]);

  if (loading) {
    return (
      <div style={styles.wrap}>
        <p style={styles.loadingTxt}>Cargando materiales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.wrap}>
        <p style={styles.errorTxt}>No se pudieron cargar los materiales.</p>
      </div>
    );
  }

  if (materiales.length === 0) {
    return (
      <div style={styles.wrap}>
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📂</span>
          <p style={styles.emptyTxt}>Esta lección no tiene materiales adjuntos.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.headerIcon}>📎</span>
        <h4 style={styles.headerTitle}>Materiales de la lección</h4>
        <span style={styles.count}>{materiales.length}</span>
      </div>

      <div style={styles.list}>
        {materiales.map((mat) => {
          const tipo = ICONOS_TIPO[mat.tipo] || ICONOS_TIPO.otro;
          return (
            <div key={mat.id} style={styles.item}>
              <div style={{ ...styles.tipoIcon, backgroundColor: tipo.bg }}>
                <span>{tipo.emoji}</span>
              </div>

              <div style={styles.info}>
                <p style={styles.nombre}>{mat.nombre}</p>
                {mat.tamaño && (
                  <p style={styles.tamano}>{mat.tamaño}</p>
                )}
              </div>

              <a
                href={mat.url}
                download
                style={styles.btnDescargar}
                title={`Descargar ${mat.nombre}`}
              >
                ↓ Descargar
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    fontFamily: "Inter, sans-serif",
    border: "0.5px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderBottom: "0.5px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  headerIcon: {
    fontSize: "14px",
  },
  headerTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  count: {
    fontSize: "11px",
    backgroundColor: "#e5e7eb",
    color: "#4b5563",
    borderRadius: "99px",
    padding: "2px 8px",
    fontWeight: "600",
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    borderBottom: "0.5px solid #f3f4f6",
    transition: "background 0.1s",
  },
  tipoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nombre: {
    fontSize: "13px",
    color: "#111827",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  tamano: {
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "2px",
  },
  btnDescargar: {
    padding: "6px 14px",
    backgroundColor: "#fff",
    color: "#185FA5",
    border: "0.5px solid #185FA5",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "Inter, sans-serif",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  loadingTxt: {
    padding: "16px",
    fontSize: "13px",
    color: "#9ca3af",
    textAlign: "center",
  },
  errorTxt: {
    padding: "16px",
    fontSize: "13px",
    color: "#dc2626",
    textAlign: "center",
  },
  emptyState: {
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  emptyIcon: {
    fontSize: "28px",
  },
  emptyTxt: {
    fontSize: "13px",
    color: "#9ca3af",
    textAlign: "center",
  },
};
