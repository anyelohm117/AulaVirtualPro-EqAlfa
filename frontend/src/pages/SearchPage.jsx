import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Check, X } from "lucide-react";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/courses.css";
import "../styles/components.css";
export default function SearchPage() {
  const navigate=useNavigate();
  const [cursos,setCursos]=useState([]); const [loading,setLoading]=useState(true); const [busqueda,setBusqueda]=useState(""); const [inscribiendo,setInscribiendo]=useState(null); const [msg,setMsg]=useState({texto:"",tipo:""});
  useEffect(()=>{ api.get("/inscripciones/disponibles").then(r=>setCursos(r.data)).catch(()=>{}).finally(()=>setLoading(false)); },[]);
  const handleInscribirse=async(cid)=>{ setInscribiendo(cid); setMsg({texto:"",tipo:""});
    try{ await api.post(`/inscripciones/${cid}`); setCursos(p=>p.map(c=>c._id===cid?{...c,yaInscrito:true}:c)); setMsg({texto:"¡Inscripción exitosa! Ya puedes verlo en Mis cursos.",tipo:"ok"}); }
    catch(err){ setMsg({texto:err.response?.data?.error||"Error al inscribirse.",tipo:"error"}); }finally{setInscribiendo(null);} };
  const filtrados=cursos.filter(c=>c.titulo.toLowerCase().includes(busqueda.toLowerCase())||c.descripcion?.toLowerCase().includes(busqueda.toLowerCase()));
  const disponibles=filtrados.filter(c=>!c.yaInscrito); const inscritos=filtrados.filter(c=>c.yaInscrito);
  const CourseCard=({curso,inscrito})=>(
    <div className={`search-card ${inscrito?'search-card-inscrito':''}`}>
      <div className={`search-card-banner ${curso.imagen?'':(inscrito?'search-card-banner-inscrito':'search-card-banner-default')}`} style={curso.imagen?{backgroundImage:`url(${curso.imagen})`,backgroundSize:'cover',backgroundPosition:'center'}:undefined}>{!curso.imagen&&<div className="search-card-banner-icon"><BookOpen size={28}/></div>}</div>
      <div className="search-card-body">
        <h3 className="search-card-title">{curso.titulo}</h3>
        <p className="search-card-desc">{curso.descripcion||'Sin descripción'}</p>
        <div className="search-card-footer">
          <span className="search-card-modules">{curso.modulos?.length||0} módulos</span>
          {inscrito?<button onClick={()=>navigate(`/course/${curso._id}`)} className="btn-go-course" style={{display:'inline-flex',alignItems:'center',gap:5}}><Check size={14}/> Ir al curso</button>
          :<button onClick={()=>handleInscribirse(curso._id)} disabled={inscribiendo===curso._id} className="btn-enroll">{inscribiendo===curso._id?'...':'Inscribirme'}</button>}
        </div>
      </div>
    </div>
  );
  return(
    <div className="page-container">
      <header className="topbar">
        <button onClick={()=>navigate("/catalog")} className="btn-back">← Mis cursos</button>
        <div className="topbar-divider"/><h1 className="topbar-title">Explorar cursos</h1>
        <div className="search-input-wrapper"><span className="search-icon"><Search size={16}/></span><input type="text" placeholder="Buscar cursos..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} className="search-input"/></div>
      </header>
      {msg.texto&&<div className={`alert ${msg.tipo==='ok'?'alert-success':'alert-error'} page-banner-alert`}><span>{msg.texto}</span><button onClick={()=>setMsg({texto:"",tipo:""})} className="alert-close"><X size={14}/></button></div>}
      <div className="page-content">
        {loading?<div className="loading-state"><p className="loading-text">Cargando cursos disponibles...</p></div>:(
          <>
            {disponibles.length>0&&<><div className="section-heading"><h2 className="section-heading-title">Disponibles</h2><span className="badge badge-primary">{disponibles.length}</span></div><div className="courses-grid">{disponibles.map(c=><CourseCard key={c._id} curso={c} inscrito={false}/>)}</div></>}
            {inscritos.length>0&&<><div className="section-heading section-heading-gap"><h2 className="section-heading-title">Ya inscrito</h2><span className="badge badge-success">{inscritos.length}</span></div><div className="courses-grid">{inscritos.map(c=><CourseCard key={c._id} curso={c} inscrito={true}/>)}</div></>}
            {disponibles.length===0&&inscritos.length===0&&<div className="empty-state"><div className="empty-state-icon"><Search size={48}/></div><p className="empty-state-desc">{busqueda?`Sin resultados para "${busqueda}"`:'No hay cursos disponibles.'}</p></div>}
          </>
        )}
      </div>
    </div>
  );
}