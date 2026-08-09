
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
const NAV=[{icon:'🏠',label:'Mis cursos',path:'/catalog'},{icon:'📚',label:'Mi progreso',path:'/progress'},{icon:'📋',label:'Tareas',path:'/assignments'},{icon:'🔍',label:'Explorar',path:'/search'}];
export default function ProgressPage() {
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  const [progresos,setProgresos]=useState([]); const [resultados,setResultados]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ Promise.all([api.get("/progreso"),api.get("/quiz/resultados/mios")]).then(([r1,r2])=>{setProgresos(r1.data);setResultados(r2.data);}).catch(console.error).finally(()=>setLoading(false)); },[]);
  const cursosComp=progresos.filter(p=>p.porcentaje===100).length;
  const quizAprobados=resultados.filter(r=>r.aprobado).length;
  const promedio=resultados.length?(resultados.reduce((a,r)=>a+r.calificacion,0)/resultados.length).toFixed(1):0;
  const stats=[{ico:'📚',val:progresos.length,lbl:'Cursos inscritos',sub:`${cursosComp} completados`,color:'#185FA5',bg:'#EFF6FF'},{ico:'🏆',val:cursosComp,lbl:'Completados',sub:'al 100%',color:'#059669',bg:'#E1F5EE'},{ico:'📝',val:resultados.length,lbl:'Quizzes realizados',sub:`${quizAprobados} aprobados`,color:'#7C3AED',bg:'#F5F3FF'},{ico:'⭐',val:promedio,lbl:'Promedio',sub:'sobre 10',color:'#D97706',bg:'#FFFBEB'}];
  return(
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Inter',sans-serif",background:'#F8FAFC'}}>
      <aside style={{width:240,background:'#1E3A5C',display:'flex',flexDirection:'column',height:'100vh',position:'sticky',top:0}}>
        <div style={{padding:'20px 18px 16px',borderBottom:'1px solid rgba(255,255,255,.08)',background:'linear-gradient(135deg,#1E3A5C,#0C2240)'}}><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:36,height:36,background:'linear-gradient(135deg,#185FA5,#2980D4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🎓</div><p style={{fontSize:13,fontWeight:700,color:'#fff'}}>AulaVirtual Pro</p></div></div>
        <nav style={{flex:1,padding:'12px 10px',display:'flex',flexDirection:'column',gap:2}}>{NAV.map(item=><button key={item.path} onClick={()=>navigate(item.path)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background:item.path==='/progress'?'rgba(255,255,255,.12)':'none',color:item.path==='/progress'?'#fff':'rgba(255,255,255,.6)',fontSize:13.5,cursor:'pointer',fontFamily:'inherit',textAlign:'left',width:'100%',fontWeight:item.path==='/progress'?500:400}}><span style={{fontSize:16,width:20,textAlign:'center'}}>{item.icon}</span>{item.label}</button>)}</nav>
        <div style={{padding:'14px 10px',borderTop:'1px solid rgba(255,255,255,.08)'}}><div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,.06)',borderRadius:8,marginBottom:8}}><div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#185FA5,#2980D4)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,flexShrink:0}}>{usuario?.[0]?.toUpperCase()||'U'}</div><p style={{fontSize:13,fontWeight:500,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{usuario}</p></div><button onClick={()=>{logout();navigate("/login");}} style={{width:'100%',padding:'8px',background:'rgba(220,38,38,.15)',border:'1px solid rgba(220,38,38,.3)',borderRadius:8,color:'#FCA5A5',fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Cerrar sesión</button></div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'0 28px',height:64,background:'#fff',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}><div><h1 style={{fontSize:17,fontWeight:600,color:'#0F172A'}}>Mi progreso</h1><p style={{fontSize:12,color:'#64748B'}}>Hola, {usuario}</p></div></div>
        <div style={{flex:1,overflowY:'auto',padding:'24px 28px'}}>
          {loading?<p style={{color:'#64748B'}}>Cargando...</p>:(
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>{stats.map(st=><div key={st.lbl} style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}><div style={{width:42,height:42,borderRadius:12,background:st.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{st.ico}</div><div><p style={{fontSize:22,fontWeight:700,color:'#0F172A',lineHeight:1}}>{st.val}</p><p style={{fontSize:11.5,color:'#64748B',marginTop:3}}>{st.lbl}</p><p style={{fontSize:11,color:st.color,marginTop:2,fontWeight:500}}>{st.sub}</p></div></div>)}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                <div style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',padding:'20px'}}>
                  <h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:16}}>Avance por curso</h3>
                  {progresos.length===0?<p style={{color:'#94A3B8',fontSize:13}}>Aún no has iniciado ningún curso.</p>:progresos.map(p=><div key={p._id} style={{cursor:'pointer',marginBottom:14}} onClick={()=>navigate(`/course/${p.cursoId?._id}`)}><div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:13,fontWeight:500,color:'#334155'}}>{p.cursoId?.titulo}</span><span style={{fontSize:12,fontWeight:600,color:'#185FA5'}}>{p.porcentaje}%</span></div><div style={{height:8,background:'#F1F5F9',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',width:`${p.porcentaje}%`,background:p.porcentaje===100?'linear-gradient(90deg,#059669,#10B981)':'linear-gradient(90deg,#185FA5,#2980D4)',borderRadius:99,transition:'width .6s'}}/></div></div>)}
                </div>
                <div style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',padding:'20px'}}>
                  <h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:16}}>Historial de evaluaciones</h3>
                  {resultados.length===0?<p style={{color:'#94A3B8',fontSize:13}}>Aún no has realizado ningún quiz.</p>:<table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}><thead><tr>{['Quiz','Calificación','Estado'].map(h=><th key={h} style={{textAlign:'left',padding:'6px 10px',fontSize:11,fontWeight:600,color:'#64748B',borderBottom:'1px solid #E2E8F0',textTransform:'uppercase',letterSpacing:'.04em'}}>{h}</th>)}</tr></thead><tbody>{resultados.map(r=><tr key={r._id}><td style={{padding:'10px',borderBottom:'1px solid #F1F5F9',color:'#334155'}}>{r.quizId?.titulo}</td><td style={{padding:'10px',borderBottom:'1px solid #F1F5F9',fontWeight:600,color:'#0F172A'}}>{r.calificacion}/10</td><td style={{padding:'10px',borderBottom:'1px solid #F1F5F9'}}><span style={{display:'inline-block',padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:600,background:r.aprobado?'#E1F5EE':'#FEF2F2',color:r.aprobado?'#059669':'#DC2626'}}>{r.aprobado?'Aprobado':'Reprobado'}</span></td></tr>)}</tbody></table>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
