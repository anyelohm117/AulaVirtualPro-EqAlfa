import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, ClipboardList, Search, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/courses.css";
import "../styles/components.css";
const NAV=[{icon:Home,label:'Mis cursos',path:'/catalog'},{icon:BookOpen,label:'Mi progreso',path:'/progress'},{icon:ClipboardList,label:'Tareas',path:'/assignments'},{icon:Search,label:'Explorar',path:'/search'}];
export default function CatalogPage() {
  const [busqueda,setBusqueda]=useState(""); const [cursos,setCursos]=useState([]); const [prog,setProg]=useState({}); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  useEffect(()=>{(async()=>{ try{ const [r1,r2]=await Promise.all([api.get("/inscripciones/mis-cursos"),api.get("/progreso")]); setCursos(r1.data); const m={}; r2.data.forEach(p=>{m[p.cursoId?._id]=p.porcentaje;}); setProg(m); }catch{setError("No se pudieron cargar tus cursos.");}finally{setLoading(false);} })();},[]);
  const filtrados=cursos.filter(c=>c.titulo.toLowerCase().includes(busqueda.toLowerCase()));
  const sidebar=(
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo"><GraduationCap size={18} color="#fff"/></div>
          <div><p className="sidebar-title">AulaVirtual Pro</p><p className="sidebar-role">Alumno</p></div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(item=><button key={item.path} onClick={()=>navigate(item.path)} className={`nav-item ${location.pathname===item.path?'active':''}`}><span className="nav-icon"><item.icon size={16}/></span>{item.label}</button>)}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">{usuario?.[0]?.toUpperCase()||'U'}</div>
          <p className="user-name">{usuario||'Alumno'}</p>
        </div>
        <button onClick={()=>{logout();navigate("/login");}} className="btn-logout">Cerrar sesión</button>
      </div>
    </aside>
  );
  return (
    <div className="app-layout">
      {sidebar}
      <div className="main-content">
        <header className="page-header">
          <div><h1 className="page-title">Mis cursos</h1><p className="page-subtitle">{cursos.length} curso{cursos.length!==1?'s':''} inscrito{cursos.length!==1?'s':''}</p></div>
          <div className="search-input-wrapper"><span className="search-icon"><Search size={16}/></span><input type="text" placeholder="Buscar..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} className="search-input"/></div>
        </header>
        <div className="page-body">
          {loading?<div className="loading-state"><div className="loading-state-inner"><div className="spinner-large"/><p className="loading-text">Cargando tus cursos...</p></div></div>
          :error?<p className="error-state">{error}</p>
          :cursos.length===0?<div className="empty-state"><div className="empty-state-icon"><BookOpen size={48}/></div><h2 className="empty-state-title">Aún no tienes cursos</h2><p className="empty-state-desc">Explora el catálogo y únete a los cursos disponibles.</p><button onClick={()=>navigate("/search")} className="btn-action-primary">Explorar cursos →</button></div>
          :filtrados.length===0?<div className="empty-state"><p className="empty-state-desc">Sin resultados para "{busqueda}"</p><button onClick={()=>setBusqueda("")} className="btn-soft">Ver todos</button></div>
          :<div className="courses-grid">
            {filtrados.map(curso=>{
              const pct=prog[curso._id]||0;
              return (
                <div key={curso._id} onClick={()=>navigate(`/course/${curso._id}`)} className="course-card">
                  <div className={`course-card-banner ${curso.imagen?'':'course-card-banner-default'}`} style={curso.imagen?{backgroundImage:`url(${curso.imagen})`,backgroundSize:'cover',backgroundPosition:'center'}:undefined}>
                    {!curso.imagen&&<div className="course-card-banner-icon"><BookOpen size={28}/></div>}
                    <div className="course-card-overlay"/>
                    <div className="course-card-progress-overlay">
                      <div className="progress-bar-thin-wrapper"><div className="progress-bar-thin-bg"><div className="progress-bar-thin-fill" style={{width:`${pct}%`}}/></div><span className="progress-bar-text">{pct}%</span></div>
                    </div>
                  </div>
                  <div className="course-card-content">
                    <h3 className="course-card-title">{curso.titulo}</h3>
                    <p className="course-card-desc">{curso.descripcion}</p>
                    <div className="course-card-footer"><span className="course-card-modules-count">{curso.modulos?.length||0} módulos</span><button className="btn-start-course">{pct>0?'Continuar →':'Comenzar →'}</button></div>
                  </div>
                </div>
              );
            })}
          </div>}
        </div>
      </div>
    </div>
  );
}