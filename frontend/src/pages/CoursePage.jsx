import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LessonViewer from "../components/LessonViewer";
import MaterialDownload from "../components/MaterialDownload";
import api from "../services/api";
import "../styles/global.css";
import "../styles/courses.css";
import "../styles/components.css";
export default function CoursePage() {
  const {id}=useParams(); const navigate=useNavigate();
  const [curso,setCurso]=useState(null); const [progreso,setProgreso]=useState({leccionesCompletadas:[],porcentaje:0}); const [loading,setLoading]=useState(true);
  const [modulosAbiertos,setModulosAbiertos]=useState({}); const [leccionActiva,setLeccionActiva]=useState(null);
  useEffect(()=>{(async()=>{ try{
    const r=await api.get(`/cursos/${id}`); setCurso(r.data);
    if(r.data.modulos?.length>0){ const pm=r.data.modulos[0]; setModulosAbiertos({[pm._id]:true}); if(pm.lecciones?.length>0)setLeccionActiva(pm.lecciones[0]); }
    try{const rp=await api.get(`/progreso/${id}`);setProgreso(rp.data);}catch{}
  }catch{console.error("Error cargando curso");}finally{setLoading(false);} })();},[id]);
  if(loading)return(<div className="loading-screen"><div className="spinner-large"/></div>);
  if(!curso)return(<div className="error-state">Curso no encontrado.</div>);
  const todasLecciones=curso.modulos.flatMap(m=>m.lecciones);
  const indexActual=todasLecciones.findIndex(l=>l._id===leccionActiva?._id);
  const totalLecciones=todasLecciones.length;
  const estaCompletada=(lid)=>progreso.leccionesCompletadas?.some(id=>id?.toString()===lid?.toString());
  const pct=Math.round(((progreso.leccionesCompletadas?.length||0)/Math.max(totalLecciones,1))*100);
  const handleCompletada=(lid)=>setProgreso(p=>({...p,leccionesCompletadas:[...(p.leccionesCompletadas||[]),lid]}));
  return (
    <div className="course-viewer-container">
      <aside className="course-sidebar">
        <div className="course-sidebar-header">
          <button onClick={()=>navigate("/catalog")} className="btn-back-link">← Mis cursos</button>
          <h2 className="course-sidebar-title">{curso.titulo}</h2>
          <div className="course-sidebar-progress">
            <div className="course-sidebar-progress-head"><span>Tu progreso</span><span className="course-sidebar-progress-pct">{pct}%</span></div>
            <div className="course-sidebar-progress-track"><div className="course-sidebar-progress-fill" style={{width:`${pct}%`}}/></div>
            <p className="course-sidebar-progress-note">{progreso.leccionesCompletadas?.length||0} de {totalLecciones} lecciones</p>
          </div>
        </div>
        <div className="course-sidebar-body">
          {curso.modulos.map((modulo,mi)=>(
            <div key={modulo._id}>
              <button onClick={()=>setModulosAbiertos(p=>({...p,[modulo._id]:!p[modulo._id]}))} className="module-accordion-item">
                <div className="module-accordion-head"><div className="module-accordion-badge">{mi+1}</div><span className="module-accordion-title">{modulo.titulo}</span></div>
                <span className="module-accordion-arrow">{modulosAbiertos[modulo._id]?'▲':'▼'}</span>
              </button>
              {modulosAbiertos[modulo._id]&&modulo.lecciones.map((lec,li)=>{
                const activa=leccionActiva?._id===lec._id; const done=estaCompletada(lec._id);
                return(<button key={lec._id} onClick={()=>setLeccionActiva(lec)} className={`lesson-item-btn ${activa?'active':''}`}>
                  <div className={`lesson-status-icon ${done?'lesson-status-done':activa?'lesson-status-active':'lesson-status-pending'}`}>{done?'✓':li+1}</div>
                  <span className={`lesson-title ${activa?'lesson-title-active':done?'lesson-title-done':''}`}>{lec.titulo}</span>
                  {lec.duracion>0&&<span className="lesson-duration">{lec.duracion}m</span>}
                </button>);
              })}
            </div>
          ))}
        </div>
      </aside>
      <div className="course-viewer-main">
        <header className="course-viewer-header">
          <div><h1 className="course-viewer-title">{leccionActiva?.titulo||'Selecciona una lección'}</h1><p className="course-viewer-subtitle">Lección {Math.max(indexActual+1,1)} de {totalLecciones}</p></div>
          <div className="course-viewer-nav">
            <button onClick={()=>{if(indexActual>0)setLeccionActiva(todasLecciones[indexActual-1]);}} disabled={indexActual<=0} className="btn-prev">← Anterior</button>
            <button onClick={()=>{if(indexActual<totalLecciones-1)setLeccionActiva(todasLecciones[indexActual+1]);else navigate(`/quiz/${id}`);}} className="btn-next">{indexActual===totalLecciones-1?'Ir al quiz →':'Siguiente →'}</button>
          </div>
        </header>
        <div className="course-viewer-body">
          {leccionActiva?(<><LessonViewer key={leccionActiva._id} leccion={{...leccionActiva,id:leccionActiva._id,completada:estaCompletada(leccionActiva._id)}} cursoId={id} onCompletada={handleCompletada}/><div className="course-viewer-material"><MaterialDownload leccionId={leccionActiva._id} cursoId={id}/></div></>)
          :(<div className="lesson-select-empty"><div><div className="lesson-select-empty-icon">👈</div><p className="lesson-select-empty-text">Selecciona una lección del panel izquierdo</p></div></div>)}
        </div>
      </div>
    </div>
  );
}