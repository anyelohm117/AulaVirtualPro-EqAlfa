
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";
import MaterialDownload from "../components/MaterialDownload";
import api from "../services/api";
export default function CoursePage() {
  const {id}=useParams(); const navigate=useNavigate();
  const [curso,setCurso]=useState(null); const [progreso,setProgreso]=useState({leccionesCompletadas:[],porcentaje:0}); const [loading,setLoading]=useState(true);
  const [modulosAbiertos,setModulosAbiertos]=useState({}); const [leccionActiva,setLeccionActiva]=useState(null);
  useEffect(()=>{(async()=>{ try{
    const r=await api.get(`/cursos/${id}`); setCurso(r.data);
    if(r.data.modulos?.length>0){ const pm=r.data.modulos[0]; setModulosAbiertos({[pm._id]:true}); if(pm.lecciones?.length>0)setLeccionActiva(pm.lecciones[0]); }
    try{const rp=await api.get(`/progreso/${id}`);setProgreso(rp.data);}catch{}
  }catch{console.error("Error cargando curso");}finally{setLoading(false);} })();},[id]);
  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:"'Inter',sans-serif"}}><div style={{width:44,height:44,border:'3px solid #E2E8F0',borderTopColor:'#185FA5',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>);
  if(!curso)return(<div style={{padding:'2rem',fontFamily:"'Inter',sans-serif",color:'#DC2626'}}>Curso no encontrado.</div>);
  const todasLecciones=curso.modulos.flatMap(m=>m.lecciones);
  const indexActual=todasLecciones.findIndex(l=>l._id===leccionActiva?._id);
  const totalLecciones=todasLecciones.length;
  const estaCompletada=(lid)=>progreso.leccionesCompletadas?.some(id=>id?.toString()===lid?.toString());
  const pct=Math.round(((progreso.leccionesCompletadas?.length||0)/Math.max(totalLecciones,1))*100);
  const handleCompletada=(lid)=>setProgreso(p=>({...p,leccionesCompletadas:[...(p.leccionesCompletadas||[]),lid]}));
  return (
    <div style={{display:'flex',height:'100vh',fontFamily:"'Inter',sans-serif",background:'#F8FAFC'}}>
      <aside style={{width:280,background:'#fff',borderRight:'1px solid #E2E8F0',display:'flex',flexDirection:'column',flexShrink:0,overflow:'hidden'}}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid #E2E8F0',background:'#1E3A5C'}}>
          <button onClick={()=>navigate("/catalog")} style={{background:'none',border:'none',color:'rgba(255,255,255,.65)',fontSize:12.5,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:5,marginBottom:10}}>← Mis cursos</button>
          <h2 style={{fontSize:13.5,fontWeight:600,color:'#fff',lineHeight:1.4}}>{curso.titulo}</h2>
          <div style={{marginTop:10}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'rgba(255,255,255,.6)',marginBottom:5}}><span>Tu progreso</span><span style={{color:'#60A5FA',fontWeight:600}}>{pct}%</span></div>
            <div style={{height:5,background:'rgba(255,255,255,.15)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#60A5FA,#2980D4)',borderRadius:99,transition:'width .6s'}}/></div>
            <p style={{fontSize:11,color:'rgba(255,255,255,.45)',marginTop:5}}>{progreso.leccionesCompletadas?.length||0} de {totalLecciones} lecciones</p>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
          {curso.modulos.map((modulo,mi)=>(
            <div key={modulo._id}>
              <button onClick={()=>setModulosAbiertos(p=>({...p,[modulo._id]:!p[modulo._id]}))} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',borderBottom:'1px solid #F1F5F9'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:22,height:22,borderRadius:'50%',background:'#185FA5',color:'#fff',fontSize:11,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{mi+1}</div><span style={{fontSize:13,fontWeight:500,color:'#334155',textAlign:'left'}}>{modulo.titulo}</span></div>
                <span style={{fontSize:11,color:'#94A3B8'}}>{modulosAbiertos[modulo._id]?'▲':'▼'}</span>
              </button>
              {modulosAbiertos[modulo._id]&&modulo.lecciones.map((lec,li)=>{
                const activa=leccionActiva?._id===lec._id; const done=estaCompletada(lec._id);
                return(<button key={lec._id} onClick={()=>setLeccionActiva(lec)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 16px 9px 24px',background:activa?'#EFF6FF':'none',border:'none',cursor:'pointer',fontFamily:'inherit',borderBottom:'1px solid #F8FAFC'}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:done?'#059669':activa?'#185FA5':'#E2E8F0',color:'#fff',fontSize:9,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{done?'✓':li+1}</div>
                  <span style={{fontSize:12.5,color:activa?'#185FA5':done?'#059669':'#475569',textAlign:'left',flex:1,lineHeight:1.3,fontWeight:activa?500:400}}>{lec.titulo}</span>
                  {lec.duracion>0&&<span style={{fontSize:10,color:'#94A3B8',flexShrink:0}}>{lec.duracion}m</span>}
                </button>);
              })}
            </div>
          ))}
        </div>
      </aside>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'0 24px',height:60,background:'#fff',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div><h1 style={{fontSize:15,fontWeight:600,color:'#0F172A'}}>{leccionActiva?.titulo||'Selecciona una lección'}</h1><p style={{fontSize:11.5,color:'#94A3B8',marginTop:1}}>Lección {Math.max(indexActual+1,1)} de {totalLecciones}</p></div>
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>{if(indexActual>0)setLeccionActiva(todasLecciones[indexActual-1]);}} disabled={indexActual<=0} style={{padding:'7px 16px',background:'#F1F5F9',color:'#475569',border:'1px solid #E2E8F0',borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'inherit',opacity:indexActual<=0?.4:1}}>← Anterior</button>
            <button onClick={()=>{if(indexActual<totalLecciones-1)setLeccionActiva(todasLecciones[indexActual+1]);else navigate(`/quiz/${id}`);}} style={{padding:'7px 16px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>{indexActual===totalLecciones-1?'Ir al quiz →':'Siguiente →'}</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'24px'}}>
          {leccionActiva?(<><LessonViewer key={leccionActiva._id} leccion={{...leccionActiva,id:leccionActiva._id,completada:estaCompletada(leccionActiva._id)}} cursoId={id} onCompletada={handleCompletada}/><div style={{marginTop:16}}><MaterialDownload leccionId={leccionActiva._id} cursoId={id}/></div></>)
          :(<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60%',textAlign:'center'}}><div><div style={{fontSize:48,marginBottom:12,opacity:.5}}>👈</div><p style={{color:'#64748B'}}>Selecciona una lección del panel izquierdo</p></div></div>)}
        </div>
      </div>
    </div>
  );
}
