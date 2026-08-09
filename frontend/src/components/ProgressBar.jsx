
export default function ProgressBar({ value = 0, height = 6, showLabel = false, color = 'blue' }) {
  const pct = Math.min(100, Math.max(0, value));
  const g = { blue:'linear-gradient(90deg,#185FA5,#2980D4)', green:'linear-gradient(90deg,#059669,#10B981)', purple:'linear-gradient(90deg,#7C3AED,#9F67F5)', amber:'linear-gradient(90deg,#D97706,#F59E0B)' };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      {showLabel && <div style={{display:'flex',justifyContent:'space-between',fontSize:11,fontWeight:500,color:'#64748B'}}><span>Progreso</span><span>{pct}%</span></div>}
      <div style={{height,background:'#E2E8F0',borderRadius:99,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:g[color]||g.blue,borderRadius:99,transition:'width .6s cubic-bezier(.4,0,.2,1)'}}/>
      </div>
    </div>
  );
}
