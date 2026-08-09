import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Users, BookOpen, BarChart3, Presentation, User, Lock, Unlock, Trash2, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/dashboard.css";
import "../styles/components.css";
export default function AdminDashboardPage() {
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  const [tab,setTab]=useState("usuarios"); const [usuarios,setUsuarios]=useState([]); const [cursos,setCursos]=useState([]); const [reporte,setReporte]=useState([]); const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false); const [formN,setFormN]=useState({nombre:"",email:"",password:"",rol:"instructor"}); const [errForm,setErrForm]=useState(""); const [guardando,setGuardando]=useState(false);
  const cargar=async()=>{ const [r1,r2,r3]=await Promise.all([api.get("/usuarios"),api.get("/cursos"),api.get("/reportes/admin")]); setUsuarios(r1.data);setCursos(r2.data);setReporte(r3.data); };
  useEffect(()=>{cargar().catch(console.error).finally(()=>setLoading(false));},[]);
  const handleToggle=async(id)=>{try{await api.patch(`/usuarios/${id}/estado`);await cargar();}catch{alert("Error");}};
  const handleDelU=async(id)=>{if(!window.confirm("¿Eliminar?"))return;try{await api.delete(`/usuarios/${id}`);await cargar();}catch{alert("Error");}};
  const handleDelC=async(id)=>{if(!window.confirm("¿Desactivar?"))return;try{await api.delete(`/cursos/${id}`);await cargar();}catch{alert("Error");}};
  const handleCrear=async(e)=>{ e.preventDefault();setErrForm(""); if(!formN.nombre||!formN.email||!formN.password){setErrForm("Todos los campos son obligatorios.");return;} setGuardando(true);
    try{await api.post("/usuarios",formN);setModal(false);setFormN({nombre:"",email:"",password:"",rol:"instructor"});await cargar();}catch(err){setErrForm(err.response?.data?.error||"Error al crear.");}finally{setGuardando(false);} };
  const rcCls=r=>({admin:'badge-danger',instructor:'badge-primary',alumno:'badge-neutral'}[r]||'badge-neutral');
  const TH=({c})=><th>{c}</th>;
  const TD=({c,strong})=><td className={strong?'table-strong':''}>{c}</td>;
  return(
    <div className="app-layout">
      {modal&&<div className="modal-backdrop">
        <div className="modal-card">
          <div className="modal-header"><h3 className="modal-title">Nuevo usuario</h3><button onClick={()=>setModal(false)} className="modal-close-btn"><X size={16}/></button></div>
          <form onSubmit={handleCrear} className="modal-body">
            {[{l:'Nombre',t:'text',k:'nombre',p:'Nombre completo'},{l:'Email',t:'email',k:'email',p:'correo@empresa.com'},{l:'Contraseña',t:'password',k:'password',p:'Mínimo 6 caracteres'}].map(f=>(<div key={f.k} className="form-field"><label className="form-label">{f.l}</label><input type={f.t} placeholder={f.p} value={formN[f.k]} onChange={e=>setFormN({...formN,[f.k]:e.target.value})} className="form-control"/></div>))}
            <div className="form-field"><label className="form-label">Rol</label><select value={formN.rol} onChange={e=>setFormN({...formN,rol:e.target.value})} className="form-control"><option value="alumno">Alumno</option><option value="instructor">Instructor</option><option value="admin">Administrador</option></select></div>
            {errForm&&<p className="form-error">{errForm}</p>}
            <div className="modal-footer"><button type="button" onClick={()=>setModal(false)} className="btn-secondary">Cancelar</button><button type="submit" disabled={guardando} className="btn-action-primary">{guardando?'Creando...':'Crear usuario'}</button></div>
          </form>
        </div>
      </div>}
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="sidebar-logo"><GraduationCap size={18} color="#fff"/></div><div><p className="sidebar-title">AulaVirtual Pro</p><p className="sidebar-role">Administrador</p></div></div></div>
        <nav className="sidebar-nav">{[[Users,'Usuarios','usuarios'],[BookOpen,'Cursos','cursos'],[BarChart3,'Reportes','reportes']].map(([Icon,lbl,t])=><button key={t} onClick={()=>setTab(t)} className={`nav-item ${tab===t?'active':''}`}><span className="nav-icon"><Icon size={16}/></span>{lbl}</button>)}</nav>
        <div className="sidebar-footer"><div className="user-profile-badge"><div className="user-avatar">{usuario?.[0]?.toUpperCase()||'A'}</div><div className="user-info"><p className="user-name">{usuario}</p><p className="sidebar-role">Administrador</p></div></div><button onClick={()=>{logout();navigate("/login");}} className="btn-logout">Cerrar sesión</button></div>
      </aside>
      <div className="main-content">
        <header className="page-header"><h1 className="page-title">{tab==='usuarios'?'Gestión de usuarios':tab==='cursos'?'Gestión de cursos':'Reportes de progreso'}</h1>{tab==='usuarios'&&<button onClick={()=>setModal(true)} className="btn-action-primary">+ Nuevo usuario</button>}</header>
        <div className="page-body">
          {loading?<p className="loading-text">Cargando datos...</p>:(
            <>
              <div className="dashboard-stats">{[[Users,usuarios.filter(u=>u.rol==='alumno').length,'Alumnos','stat-icon-blue','var(--primary)'],[Presentation,usuarios.filter(u=>u.rol==='instructor').length,'Instructores','stat-icon-green','var(--success)'],[BookOpen,cursos.filter(c=>c.activo).length,'Cursos activos','stat-icon-purple','var(--purple)'],[User,usuarios.length,'Usuarios total','stat-icon-amber','var(--warning)']].map(([Icon,val,lbl,icn,clr])=><div key={lbl} className="stat-card"><div className={`stat-icon-box ${icn}`}><Icon size={20} color={clr}/></div><div><p className="stat-value">{val}</p><p className="stat-label">{lbl}</p></div></div>)}</div>
              {tab==='usuarios'&&<div className="table-card"><table className="data-table"><thead><tr>{['Nombre','Email','Rol','Estado','Acciones'].map(h=><TH key={h} c={h}/>)}</tr></thead><tbody>{usuarios.map(u=>{const rc=rcCls(u.rol);return(<tr key={u._id}><TD c={<div className="cell-user"><div className="table-avatar">{u.nombre?.[0]?.toUpperCase()||'?'}</div><span className="table-strong">{u.nombre}</span></div>}/><TD c={u.email}/><TD c={<span className={`badge ${rc}`}>{u.rol}</span>}/><TD c={<span className={`badge ${u.activo?'badge-success':'badge-inactive'}`}>{u.activo?'Activo':'Inactivo'}</span>}/><TD c={<div className="cell-actions"><button onClick={()=>handleToggle(u._id)} className="icon-btn">{u.activo?<Lock size={14}/>:<Unlock size={14}/>}</button><button onClick={()=>handleDelU(u._id)} className="icon-btn icon-btn-danger"><Trash2 size={14}/></button></div>}/></tr>);})}</tbody></table></div>}
              {tab==='cursos'&&<div className="table-card"><table className="data-table"><thead><tr>{['Curso','Módulos','Estado','Acciones'].map(h=><TH key={h} c={h}/>)}</tr></thead><tbody>{cursos.map(c=><tr key={c._id}><TD c={c.titulo} strong/><TD c={c.modulos?.length||0}/><TD c={<span className={`badge ${c.activo?'badge-success':'badge-danger'}`}>{c.activo?'Activo':'Inactivo'}</span>}/><TD c={<div className="cell-actions"><button onClick={()=>handleDelC(c._id)} className="icon-btn icon-btn-danger"><Trash2 size={14}/></button></div>}/></tr>)}</tbody></table></div>}
              {tab==='reportes'&&(reporte.length===0?<div className="empty-state"><p className="panel-empty">Sin datos de progreso aún.</p></div>:<div className="table-card"><table className="data-table"><thead><tr>{['Alumno','Email','Cursos','Quizzes','Aprobados'].map(h=><TH key={h} c={h}/>)}</tr></thead><tbody>{reporte.map(r=><tr key={r.alumno.id}><TD c={r.alumno.nombre} strong/><TD c={r.alumno.email}/><TD c={r.progresos.length}/><TD c={r.calificaciones.length}/><TD c={<span className={`badge ${r.calificaciones.filter(c=>c.aprobado).length>0?'badge-success':'badge-neutral'}`}>{r.calificaciones.filter(c=>c.aprobado).length}/{r.calificaciones.length}</span>}/></tr>)}</tbody></table></div>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}