/**
 * ProgressBar.jsx
 * Uso: <ProgressBar value={65} />
 * Props:
 *   value       número 0-100 (porcentaje de avance)
 *   showLabel   booleano, muestra el % en texto (default: true)
 *   height      altura de la barra en px (default: 6)
 *   color       color del fill (default: "#185FA5")
 */
export default function ProgressBar({
  value = 0,
  showLabel = true,
  height = 6,
  color = "#185FA5",
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div style={styles.wrap}>
      <div style={{ ...styles.track, height }}>
        <div
          style={{
            ...styles.fill,
            width: `${pct}%`,
            height,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <span style={{ ...styles.label, color }}>{pct}%</span>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  track: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: "99px",
    overflow: "hidden",
  },
  fill: {
    borderRadius: "99px",
    transition: "width 0.4s ease",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    minWidth: "30px",
    textAlign: "right",
    fontFamily: "Inter, sans-serif",
  },
};
