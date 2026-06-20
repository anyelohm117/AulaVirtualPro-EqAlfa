import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProgressPage() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [progresos, setProgresos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resProgreso, resResultados] = await Promise.all([
          api.get("/progreso"),
          api.get("/quiz/resultados/mios"),
        ]);
        setProgresos(resProgreso.data);
        setResultados(resResultados.data);
      } catch (err) {
        console.error("Error al cargar progreso:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const cursosCompletados = progresos.filter((p) => p.porcentaje === 100).length;
  const quizzesAprobados = resultados.filter((r) => r.aprobado).length;
  const promedio = resultados.length
    ? Math.round(resultados.reduce((acc, r) => acc + r.calificacion, 0) / resultados.length * 10)
    : 0;

  if (loading) {
    return <div style={styles.page}><p>Cargando progreso...</p></div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topbar}>
          <h2 style={styles.topTitle}>Mi progreso</h2>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{usuario ? usuario.charAt(0).toUpperCase() : "U"}</div>
            <span style={styles.userName}>{usuario || "Usuario"}</span>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Cursos completados</p>
            <p style={styles.statVal}>{cursosCompletados}</p>
            <p style={styles.statSub}>de {progresos.length} inscritos</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Quizzes aprobados</p>
            <p style={styles.statVal}>{quizzesAprobados}</p>
            <p style={styles.statSub}>de {resultados.length} realizados</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Calificación promedio</p>
            <p style={styles.statVal}>{promedio}</p>
            <p style={styles.statSub}>sobre 100</p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Avance por curso</h3>
          {progresos.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>Aún no has iniciado ningún curso.</p>
          ) : (
            progresos.map((p) => (
              <div key={p._id} style={styles.cursoRow} onClick={() => navigate(`/course/${p.cursoId?._id}`)}>
                <span style={styles.cursoNombre}>{p.cursoId?.titulo}</span>
                <div style={styles.barWrap}>
                  <div style={{ ...styles.barFill, width: `${p.porcentaje}%` }} />
                </div>
                <span style={styles.barPct}>{p.porcentaje}%</span>
              </div>
            ))
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Historial de quizzes</h3>
          {resultados.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>Aún no has realizado ningún quiz.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Quiz</th>
                  <th style={styles.th}>Puntaje</th>
                  <th style={styles.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r) => (
                  <tr key={r._id}>
                    <td style={styles.td}>{r.quizId?.titulo}</td>
                    <td style={styles.td}>{r.calificacion}/10</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: r.aprobado ? "#dcfce7" : "#fee2e2",
                        color: r.aprobado ? "#15803d" : "#dc2626",
                      }}>
                        {r.aprobado ? "Aprobado" : "Reprobado"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.btnVolver} onClick={() => navigate("/catalog")}>← Volver al catálogo</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8", fontFamily: "Inter, sans-serif", padding: "2rem" },
  card: { backgroundColor: "#fff", borderRadius: "16px", border: "0.5px solid #e5e7eb", overflow: "hidden", maxWidth: "900px", margin: "0 auto" },
  topbar: { padding: "14px 20px", borderBottom: "0.5px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" },
  topTitle: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  userInfo: { display: "flex", alignItems: "center", gap: "8px" },
  avatar: { width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "#185FA5" },
  userName: { fontSize: "13px", color: "#6b7280" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", padding: "16px 20px", borderBottom: "0.5px solid #e5e7eb" },
  statCard: { backgroundColor: "#f9fafb", borderRadius: "8px", padding: "14px" },
  statLabel: { fontSize: "11px", color: "#6b7280", marginBottom: "6px" },
  statVal: { fontSize: "24px", fontWeight: "600", color: "#111827" },
  statSub: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },
  section: { padding: "16px 20px", borderBottom: "0.5px solid #e5e7eb" },
  sectionTitle: { fontSize: "13px", fontWeight: "600", color: "#111827", marginBottom: "12px" },
  cursoRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", cursor: "pointer" },
  cursoNombre: { fontSize: "12px", color: "#111827", width: "200px", flexShrink: 0 },
  barWrap: { flex: 1, height: "6px", backgroundColor: "#e5e7eb", borderRadius: "3px" },
  barFill: { height: "100%", borderRadius: "3px", backgroundColor: "#185FA5" },
  barPct: { fontSize: "11px", color: "#185FA5", width: "36px", textAlign: "right", flexShrink: 0 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "12px" },
  th: { textAlign: "left", padding: "6px 8px", fontSize: "11px", fontWeight: "600", color: "#6b7280", borderBottom: "0.5px solid #e5e7eb" },
  td: { padding: "8px", color: "#111827", borderBottom: "0.5px solid #e5e7eb" },
  badge: { display: "inline-block", padding: "2px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" },
  footer: { padding: "14px 20px", display: "flex", justifyContent: "flex-start" },
  btnVolver: { padding: "9px 20px", backgroundColor: "#fff", color: "#185FA5", border: "0.5px solid #185FA5", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" },
};