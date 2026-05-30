import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const cursoData = {
  titulo: "Introducción a la programación",
  progreso: 2,
  totalLecciones: 5,
  modulos: [
    {
      id: 1,
      titulo: "Módulo 1: Fundamentos",
      lecciones: [
        { id: 1, titulo: "1.1 ¿Qué es programar?", contenido: "Programar es el proceso de diseñar e implementar un programa de computadora. En esta lección aprenderás los conceptos básicos que todo programador debe conocer para comenzar a escribir código." },
        { id: 2, titulo: "1.2 Tipos de datos", contenido: "Los tipos de datos definen qué clase de valor puede almacenar una variable. Los más comunes son: enteros, flotantes, cadenas de texto y booleanos." },
      ],
    },
    {
      id: 2,
      titulo: "Módulo 2: Estructuras",
      lecciones: [
        { id: 3, titulo: "2.1 Condicionales", contenido: "Las estructuras condicionales permiten ejecutar diferentes bloques de código según una condición. El if/else es la más común." },
        { id: 4, titulo: "2.2 Ciclos", contenido: "Los ciclos permiten repetir un bloque de código múltiples veces. Los más usados son for y while." },
      ],
    },
    {
      id: 3,
      titulo: "Módulo 3: Funciones",
      lecciones: [
        { id: 5, titulo: "3.1 Definir funciones", contenido: "Una función es un bloque de código reutilizable que realiza una tarea específica. Se define con la palabra clave function o con arrow functions." },
      ],
    },
  ],
};

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modulosAbiertos, setModulosAbiertos] = useState({ 1: true });
  const [leccionActiva, setLeccionActiva] = useState(cursoData.modulos[0].lecciones[0]);

  const todasLecciones = cursoData.modulos.flatMap((m) => m.lecciones);
  const indexActual = todasLecciones.findIndex((l) => l.id === leccionActiva.id);

  const toggleModulo = (moduloId) => {
    setModulosAbiertos((prev) => ({ ...prev, [moduloId]: !prev[moduloId] }));
  };

  const irAnterior = () => {
    if (indexActual > 0) setLeccionActiva(todasLecciones[indexActual - 1]);
  };

  const irSiguiente = () => {
    if (indexActual < todasLecciones.length - 1) {
      setLeccionActiva(todasLecciones[indexActual + 1]);
    } else {
      navigate(`/quiz/${id}`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sideHeader}>
          <h3 style={styles.sideTitle}>{cursoData.titulo}</h3>
        </div>
        <div style={styles.sideProgress}>
          <div style={styles.progBar}>
            <div style={{ ...styles.progFill, width: `${(cursoData.progreso / cursoData.totalLecciones) * 100}%` }} />
          </div>
          <span style={styles.progTxt}>{cursoData.progreso} / {cursoData.totalLecciones} lecciones</span>
        </div>

        {cursoData.modulos.map((modulo) => (
          <div key={modulo.id} style={styles.modulo}>
            <div style={styles.moduloHeader} onClick={() => toggleModulo(modulo.id)}>
              <span>{modulo.titulo}</span>
              <span style={styles.chevron}>{modulosAbiertos[modulo.id] ? "▾" : "▸"}</span>
            </div>
            {modulosAbiertos[modulo.id] &&
              modulo.lecciones.map((leccion) => (
                <div
                  key={leccion.id}
                  style={{
                    ...styles.leccion,
                    ...(leccionActiva.id === leccion.id ? styles.leccionActiva : {}),
                  }}
                  onClick={() => setLeccionActiva(leccion)}
                >
                  <span style={styles.playIcon}>▶</span>
                  {leccion.titulo}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>{leccionActiva.titulo}</h2>
          <span style={styles.topCount}>{indexActual + 1} / {todasLecciones.length}</span>
        </div>

        <div style={styles.content}>
          <div style={styles.videoPlaceholder}>
            <span style={{ fontSize: "40px", color: "#9ca3af" }}>▶</span>
          </div>
          <p style={styles.lessonText}>{leccionActiva.contenido}</p>
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
  sidebar: {
    width: "240px",
    borderRight: "0.5px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
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
  },
  progBar: {
    height: "4px",
    backgroundColor: "#e5e7eb",
    borderRadius: "2px",
    marginBottom: "4px",
  },
  progFill: {
    height: "100%",
    borderRadius: "2px",
    backgroundColor: "#185FA5",
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
  },
  leccionActiva: {
    color: "#185FA5",
    backgroundColor: "#E6F1FB",
  },
  playIcon: {
    fontSize: "9px",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
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
  },
  videoPlaceholder: {
    height: "200px",
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    border: "0.5px solid #e5e7eb",
  },
  lessonText: {
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.7",
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