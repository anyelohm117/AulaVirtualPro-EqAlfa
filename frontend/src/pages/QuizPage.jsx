import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const quizData = {
  titulo: "Quiz: Tipos de datos",
  preguntas: [
    {
      id: 1,
      texto: "¿Cuál de los siguientes es un tipo de dato numérico?",
      opciones: ["Cadena", "Booleano", "Entero", "Caracter"],
      correcta: 2,
    },
    {
      id: 2,
      texto: "¿Qué estructura se usa para repetir código?",
      opciones: ["if/else", "función", "ciclo for", "variable"],
      correcta: 2,
    },
    {
      id: 3,
      texto: "¿Qué palabra clave define una función en JavaScript?",
      opciones: ["def", "function", "fun", "method"],
      correcta: 1,
    },
  ],
};

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actual, setActual] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [terminado, setTerminado] = useState(false);

  const pregunta = quizData.preguntas[actual];
  const total = quizData.preguntas.length;
  const correctas = respuestas.filter((r) => r.correcta).length;
  const puntaje = Math.round((correctas / total) * 100);
  const aprobado = puntaje >= 70;

  const handleSeleccion = (i) => {
    if (seleccionada !== null) return;
    setSeleccionada(i);
  };

  const handleSiguiente = () => {
    const nuevasRespuestas = [
      ...respuestas,
      { correcta: seleccionada === pregunta.correcta },
    ];
    setRespuestas(nuevasRespuestas);

    if (actual + 1 >= total) {
      setTerminado(true);
    } else {
      setActual(actual + 1);
      setSeleccionada(null);
    }
  };

  if (terminado) {
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={styles.resultIcon}>{aprobado ? "✅" : "❌"}</div>
          <h2 style={styles.resultTitle}>
            {aprobado ? "¡Felicitaciones!" : "Sigue practicando"}
          </h2>
          <p style={styles.resultSub}>
            {aprobado
              ? "Has aprobado el quiz satisfactoriamente."
              : "No alcanzaste el puntaje mínimo. Intenta de nuevo."}
          </p>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNum}>{puntaje}</span>
            <span style={styles.scoreMax}>/100</span>
          </div>
          <p style={styles.scoreSub}>
            {correctas} de {total} respuestas correctas
          </p>
          <p
            style={{
              ...styles.aprobadoBadge,
              backgroundColor: aprobado ? "#dcfce7" : "#fee2e2",
              color: aprobado ? "#15803d" : "#dc2626",
            }}
          >
            {aprobado ? "APROBADO" : "REPROBADO"}
          </p>
          <div style={styles.resultBtns}>
            <button
              style={styles.btnSecundario}
              onClick={() => navigate(`/course/${id}`)}
            >
              Volver al curso
            </button>
            <button
              style={styles.btnPrimario}
              onClick={() => navigate("/progress")}
            >
              Ver mi progreso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.quizCard}>
        <div style={styles.progBar}>
          <div
            style={{
              ...styles.progFill,
              width: `${((actual + 1) / total) * 100}%`,
            }}
          />
        </div>

        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>{quizData.titulo}</h2>
          <span style={styles.counter}>
            Pregunta {actual + 1} de {total}
          </span>
        </div>

        <div style={styles.body}>
          <p style={styles.question}>{pregunta.texto}</p>
          {pregunta.opciones.map((op, i) => (
            <div
              key={i}
              style={{
                ...styles.option,
                ...(seleccionada === i ? styles.optionSelected : {}),
                ...(seleccionada !== null && i === pregunta.correcta
                  ? styles.optionCorrect
                  : {}),
                ...(seleccionada === i && i !== pregunta.correcta
                  ? styles.optionWrong
                  : {}),
              }}
              onClick={() => handleSeleccion(i)}
            >
              <div
                style={{
                  ...styles.radio,
                  ...(seleccionada === i ? styles.radioSelected : {}),
                }}
              >
                {seleccionada === i && <div style={styles.radioDot} />}
              </div>
              <span>{op}</span>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <button
            style={{
              ...styles.btnSiguiente,
              ...(seleccionada === null ? styles.btnDisabled : {}),
            }}
            onClick={handleSiguiente}
            disabled={seleccionada === null}
          >
            {actual + 1 === total ? "Ver resultado" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
    padding: "2rem",
  },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    width: "100%",
    maxWidth: "600px",
    border: "0.5px solid #e5e7eb",
  },
  progBar: {
    height: "4px",
    backgroundColor: "#e5e7eb",
  },
  progFill: {
    height: "100%",
    backgroundColor: "#185FA5",
    transition: "width 0.3s",
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
  counter: {
    fontSize: "12px",
    color: "#6b7280",
  },
  body: {
    padding: "24px 28px",
  },
  question: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    border: "0.5px solid #d1d5db",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#374151",
    userSelect: "none",
  },
  optionSelected: {
    borderColor: "#185FA5",
    backgroundColor: "#E6F1FB",
    color: "#185FA5",
  },
  optionCorrect: {
    borderColor: "#15803d",
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  optionWrong: {
    borderColor: "#dc2626",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  radio: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1.5px solid #d1d5db",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#185FA5",
    backgroundColor: "#185FA5",
  },
  radioDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
  footer: {
    padding: "14px 20px",
    borderTop: "0.5px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
  },
  btnSiguiente: {
    padding: "9px 24px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  btnDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "480px",
    textAlign: "center",
    border: "0.5px solid #e5e7eb",
  },
  resultIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  resultTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  resultSub: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "20px",
  },
  scoreCircle: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "4px",
    marginBottom: "8px",
  },
  scoreNum: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#111827",
  },
  scoreMax: {
    fontSize: "20px",
    color: "#6b7280",
  },
  scoreSub: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  aprobadoBadge: {
    display: "inline-block",
    padding: "4px 16px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "24px",
  },
  resultBtns: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btnSecundario: {
    padding: "9px 20px",
    backgroundColor: "#fff",
    color: "#185FA5",
    border: "0.5px solid #185FA5",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
  btnPrimario: {
    padding: "9px 20px",
    backgroundColor: "#185FA5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  },
};