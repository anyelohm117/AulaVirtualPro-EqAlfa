import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, ClipboardList, Pencil, Trash2, Package, Layers, FileText, ChevronUp, ChevronDown, Timer, Paperclip, Calendar, Users, X, MessageSquare, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/dashboard.css";
import "../styles/components.css";
export default function TeacherDashboardPage() {
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  const [cursos,setCursos]=useState([]); const [loading,setLoading]=useState(true); const [vista,setVista]=useState("lista"); const [cursoSel,setCursoSel]=useState(null); const [guardando,setGuardando]=useState(false); const [error,setError]=useState(""); const [exito,setExito]=useState(""); const [form,setForm]=useState({titulo:"",descripcion:"",imagen:""});
  const [tabActiva,setTabActiva]=useState("cursos"); const [tareas,setTareas]=useState([]); const [cursoTarea,setCursoTarea]=useState(""); const [formT,setFormT]=useState({titulo:"",descripcion:"",fechaEntrega:"",puntos:100}); const [vistaT,setVistaT]=useState("lista"); const [errT,setErrT]=useState(""); const [exitoT,setExitoT]=useState("");
  const [cursoDetalle,setCursoDetalle]=useState(null); const [modOpen,setModOpen]=useState(null); const [formMod,setFormMod]=useState({titulo:""}); const [formLec,setFormLec]=useState({titulo:"",contenido:"",materialURL:"",duracion:0}); const [vistaM,setVistaM]=useState(null); const [lecEdit,setLecEdit]=useState(null); const [errM,setErrM]=useState(""); const [guardM,setGuardM]=useState(false);
  const [entregas,setEntregas]=useState([]); const [tareaEntregas,setTareaEntregas]=useState(null); const [cargandoEnt,setCargandoEnt]=useState(false); const [errEnt,setErrEnt]=useState("");
  useEffect(()=>{cargarCursos();},[]);
  const cargarCursos=async()=>{ setLoading(true); try{const r=await api.get("/cursos");setCursos(r.data);}catch{setError("Error al cargar.");}finally{setLoading(false);} };
  const cargarTareas=async(cid)=>{ if(!cid)return; try{const r=await api.get(`/tareas/curso/${cid}`);setTareas(r.data);}catch{setTareas([]);} };
  const recargarDetalle=async()=>{ if(!cursoDetalle)return; const r=await api.get(`/cursos/${cursoDetalle._id}`); setCursoDetalle(r.data); };
  const abrirEditar=(c)=>{ setForm({titulo:c.titulo,descripcion:c.descripcion||"",imagen:c.imagen||""}); setCursoSel(c); setError(""); setExito(""); setVista("editar"); };
  const abrirModulos=async(c)=>{ const r=await api.get(`/cursos/${c._id}`); setCursoDetalle(r.data); setVista("modulos"); setVistaM(null); setModOpen(null); setErrM(""); };
  const handleGuardar=async(e)=>{ e.preventDefault(); if(!form.titulo.trim()){setError("Título obligatorio.");return;} setGuardando(true); setError(""); try{ if(vista==="crear"){await api.post("/cursos",form);setExito("Curso creado");}else{await api.put(`/cursos/${cursoSel._id}`,form);setExito("Curso actualizado");} await cargarCursos(); setTimeout(()=>{setExito("");setVista("lista");},1500); }catch(err){setError(err.response?.data?.error||"Error.");}finally{setGuardando(false);} };
  const handleEliminar=async(c)=>{ if(!window.confirm(`¿Eliminar "${c.titulo}"?`))return; try{await api.delete(`/cursos/${c._id}`);await cargarCursos();}catch{alert("Error.");} };
  const handleAddMod=async(e)=>{ e.preventDefault(); if(!formMod.titulo){setErrM("Título obligatorio.");return;} setGuardM(true); setErrM(""); try{await api.post(`/cursos/${cursoDetalle._id}/modulos`,{titulo:formMod.titulo,orden:cursoDetalle.modulos.length+1});setFormMod({titulo:""});setVistaM(null);await recargarDetalle();}catch(err){setErrM(err.response?.data?.error||"Error.");}finally{setGuardM(false);} };
  const handleDelMod=async(mid)=>{ if(!window.confirm("¿Eliminar módulo y sus lecciones?"))return; try{await api.delete(`/cursos/${cursoDetalle._id}/modulos/${mid}`);if(modOpen===mid)setModOpen(null);await recargarDetalle();}catch{alert("Error.");} };
  const handleAddLec=async(e)=>{ e.preventDefault(); if(!formLec.titulo){setErrM("Título obligatorio.");return;} setGuardM(true); setErrM(""); try{await api.post(`/cursos/${cursoDetalle._id}/modulos/${modOpen}/lecciones`,formLec);setFormLec({titulo:"",contenido:"",materialURL:"",duracion:0});setVistaM(null);await recargarDetalle();}catch(err){setErrM(err.response?.data?.error||"Error.");}finally{setGuardM(false);} };
  const handleUpdLec=async(e)=>{ e.preventDefault(); if(!formLec.titulo){setErrM("Título obligatorio.");return;} setGuardM(true); setErrM(""); try{await api.put(`/cursos/${cursoDetalle._id}/modulos/${modOpen}/lecciones/${lecEdit._id}`,formLec);setVistaM(null);setLecEdit(null);await recargarDetalle();}catch(err){setErrM(err.response?.data?.error||"Error.");}finally{setGuardM(false);} };
  const handleDelLec=async(mid,lid)=>{ if(!window.confirm("¿Eliminar lección?"))return; try{await api.delete(`/cursos/${cursoDetalle._id}/modulos/${mid}/lecciones/${lid}`);await recargarDetalle();}catch{alert("Error.");} };
  const abrirEditLec=(mod,lec)=>{ setModOpen(mod._id); setLecEdit(lec); setFormLec({titulo:lec.titulo,contenido:lec.contenido||"",materialURL:lec.materialURL||"",duracion:lec.duracion||0}); setVistaM("editLec"); setErrM(""); };
  const handleCrearTarea=async(e)=>{ e.preventDefault(); if(!formT.titulo||!formT.fechaEntrega||!cursoTarea){setErrT("Completa todos los campos.");return;} try{await api.post("/tareas",{...formT,cursoId:cursoTarea});setExitoT("Tarea creada");setFormT({titulo:"",descripcion:"",fechaEntrega:"",puntos:100});await cargarTareas(cursoTarea);setTimeout(()=>{setExitoT("");setVistaT("lista");},1500);}catch(err){setErrT(err.response?.data?.error||"Error.");} };
  const handleDelTarea=async(id)=>{ if(!window.confirm("¿Eliminar tarea?"))return; try{await api.delete(`/tareas/${id}`);await cargarTareas(cursoTarea);}catch{alert("Error.");} };
  const verEntregas=async(t)=>{ setTareaEntregas(t); setCargandoEnt(true); setErrEnt(""); try{const r=await api.get(`/tareas/${t._id}/entregas`);setEntregas(r.data);}catch(err){setErrEnt(err.response?.data?.error||"Error al cargar entregas.");setEntregas([]);}finally{setCargandoEnt(false);} };
  const cambiarTab=(t)=>{ setTabActiva(t); setVista("lista"); if(t==="tareas"&&cursos.length>0){const cid=cursos[0]._id;setCursoTarea(cid);cargarTareas(cid);} };
  const totalModulos=cursos.reduce((a,c)=>a+(c.modulos?.length||0),0);
  const totalLecciones=cursos.reduce((a,c)=>a+(c.modulos?.reduce((x,m)=>x+(m.lecciones?.length||0),0)||0),0);
  return(
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="sidebar-logo"><GraduationCap size={18} color="#fff"/></div><div><p className="sidebar-title">AulaVirtual Pro</p><p className="sidebar-role">Instructor</p></div></div></div>
        <nav className="sidebar-nav">{[[BookOpen,'Mis Cursos','cursos'],[ClipboardList,'Tareas','tareas']].map(([Icon,lbl,t])=><button key={t} onClick={()=>cambiarTab(t)} className={`nav-item ${tabActiva===t?'active':''}`}><span className="nav-icon"><Icon size={16}/></span>{lbl}</button>)}</nav>
        <div className="sidebar-footer"><div className="user-profile-badge"><div className="user-avatar">{usuario?.[0]?.toUpperCase()||'P'}</div><div><p className="user-name">{usuario||'Profesor'}</p><p className="sidebar-role">Instructor</p></div></div><button onClick={()=>{logout();navigate("/login");}} className="btn-logout">Cerrar sesión</button></div>
      </aside>
      <main className="dashboard-main">
        {tabActiva==="cursos"&&(
          <>
            <div className="section-header">
              <div><h1 className="section-title">{vista==='lista'?'Mis Cursos':vista==='crear'?'Crear Curso':vista==='editar'?'Editar Curso':<span style={{display:'inline-flex',alignItems:'center',gap:8}}><BookOpen size={20}/>{cursoDetalle?.titulo}</span>}</h1><p className="section-subtitle">{vista==='lista'?`${cursos.length} curso(s)`:vista==='modulos'?`${cursoDetalle?.modulos?.length||0} módulos · ${cursoDetalle?.modulos?.reduce((a,m)=>a+m.lecciones.length,0)||0} lecciones`:''}</p></div>
              <div className="section-actions">
                {vista==='lista'&&<button onClick={()=>{setForm({titulo:"",descripcion:"",imagen:""});setCursoSel(null);setError("");setExito("");setVista("crear");}} className="btn-action-primary">+ Nuevo Curso</button>}
                {vista==='modulos'&&<><button onClick={()=>{setVista("lista");setCursoDetalle(null);}} className="btn-secondary">← Volver</button><button onClick={()=>{setVistaM("addMod");setErrM("");}} className="btn-accent">+ Módulo</button></>}
                {(vista==='crear'||vista==='editar')&&<button onClick={()=>{setVista("lista");setError("");setExito("");}} className="btn-secondary">Cancelar</button>}
              </div>
            </div>
            {vista==='lista'&&(
              <>
                {loading&&<p className="loading-text">Cargando cursos...</p>}
                {error&&<p className="form-error">{error}</p>}
                {!loading&&cursos.length===0&&<div className="empty-state"><div className="empty-state-icon"><BookOpen size={48}/></div><p className="empty-state-desc">Aún no has creado cursos</p><button onClick={()=>{setForm({titulo:"",descripcion:"",imagen:""});setCursoSel(null);setVista("crear");}} className="btn-action-primary">Crear primer curso</button></div>}
                {!loading&&cursos.length>0&&<div className="teacher-summary">
                  {[[BookOpen,cursos.length,'Cursos']].map(([Icon,val,lbl])=><div key={lbl} className="summary-card"><div className="summary-icon-box"><Icon size={18} color="var(--primary)"/></div><div><p className="summary-value">{val}</p><p className="summary-label">{lbl}</p></div></div>)}
                </div>}
                <div className="teacher-course-grid">
                  {cursos.map(c=>(
                    <div key={c._id} className="teacher-course-card">
                      <div className="teacher-course-banner" style={c.imagen?{backgroundImage:`url(${c.imagen})`,backgroundSize:'cover',backgroundPosition:'center'}:undefined}>{!c.imagen&&<span className="teacher-course-banner-icon"><BookOpen size={22}/></span>}<div className="teacher-course-status"><span className={`badge ${c.activo?'badge-success':'badge-danger'}`}>{c.activo?'Activo':'Inactivo'}</span></div></div>
                      <div className="teacher-course-body">
                        <h3 className="teacher-course-title">{c.titulo}</h3>
                        <p className="teacher-course-desc">{c.descripcion||'Sin descripción'}</p>
                        <div className="teacher-course-actions"><button onClick={()=>abrirEditar(c)} className="btn-card-edit"><Pencil size={14}/> Editar</button><button onClick={()=>abrirModulos(c)} className="btn-card-modules"><BookOpen size={14}/> Módulos</button><button onClick={()=>handleEliminar(c)} className="btn-card-delete"><Trash2 size={14}/></button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {(vista==='crear'||vista==='editar')&&(
              <div className="form-card">
                <form onSubmit={handleGuardar} className="form-stack">
                  {[{label:'Título del curso *',key:'titulo',ph:'Ej. Excel para Negocios'},{label:'Descripción',key:'descripcion',ph:'Describe el contenido del curso...',area:true},{label:'URL de imagen de portada',key:'imagen',ph:'https://ejemplo.com/imagen.jpg',type:'url'}].map(f=>(<div key={f.key} className="form-field"><label className="form-label">{f.label}</label>{f.area?<textarea placeholder={f.ph} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} className="form-control form-textarea form-textarea-lg"/>:<input type={f.type||'text'} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} className="form-control"/>}{f.key==='imagen'&&form.imagen&&<img src={form.imagen} alt="preview" className="image-preview" onError={e=>e.target.style.display='none'}/>}</div>))}
                  {error&&<p className="form-error">{error}</p>}{exito&&<p className="form-success">{exito}</p>}
                  <div className="form-actions"><button type="button" onClick={()=>{setVista("lista");setError("");setExito("");}} className="btn-secondary">Cancelar</button><button type="submit" disabled={guardando} className="btn-action-primary">{guardando?'Guardando...':vista==='crear'?'Crear Curso':'Guardar Cambios'}</button></div>
                </form>
              </div>
            )}
            {vista==='modulos'&&cursoDetalle&&(
              <div className="module-list">
                {vistaM==='addMod'&&<div className="editor-panel editor-panel-purple"><h3 className="editor-panel-title">Nuevo módulo</h3><form onSubmit={handleAddMod} className="editor-form-inline"><div className="field-grow"><label className="form-label">Título *</label><input className="form-control" placeholder="Ej. Fundamentos básicos" value={formMod.titulo} onChange={e=>setFormMod({titulo:e.target.value})}/></div><button type="submit" disabled={guardM} className="btn-accent">{guardM?'Guardando...':'Agregar'}</button><button type="button" onClick={()=>setVistaM(null)} className="btn-secondary">Cancelar</button></form>{errM&&<p className="form-error">{errM}</p>}</div>}
                {(vistaM==='addLec'||vistaM==='editLec')&&<div className="editor-panel editor-panel-primary"><h3 className="editor-panel-title">{vistaM==='addLec'?'Nueva lección':`Editando: ${lecEdit?.titulo}`}</h3><form onSubmit={vistaM==='addLec'?handleAddLec:handleUpdLec} className="form-stack">{[{label:'Título *',key:'titulo',ph:'Ej. Introducción al tema'},{label:'Contenido/descripción',key:'contenido',ph:'Describe de qué trata esta lección...',area:true},{label:'URL del material (YouTube, Drive, PDF...)',key:'materialURL',ph:'https://youtube.com/watch?v=... o https://drive.google.com/...'}].map(f=><div key={f.key} className="form-field"><label className="form-label">{f.label}</label>{f.area?<textarea placeholder={f.ph} value={formLec[f.key]} onChange={e=>setFormLec({...formLec,[f.key]:e.target.value})} className="form-control form-textarea"/>:<input type="text" placeholder={f.ph} value={formLec[f.key]} onChange={e=>setFormLec({...formLec,[f.key]:e.target.value})} className="form-control"/>}</div>)}<div className="form-field"><label className="form-label">Duración (minutos)</label><input type="number" min={0} value={formLec.duracion} onChange={e=>setFormLec({...formLec,duracion:Number(e.target.value)})} className="form-control form-control-narrow"/></div>{errM&&<p className="form-error">{errM}</p>}<div className="form-actions"><button type="button" onClick={()=>{setVistaM(null);setLecEdit(null);setErrM("");}} className="btn-secondary">Cancelar</button><button type="submit" disabled={guardM} className="btn-action-primary">{guardM?'Guardando...':vistaM==='addLec'?'Agregar lección':'Guardar cambios'}</button></div></form></div>}
                {cursoDetalle.modulos.length===0?<div className="empty-state"><div className="empty-state-icon"><Package size={48}/></div><p className="empty-state-desc">Sin módulos todavía</p><button onClick={()=>setVistaM("addMod")} className="btn-accent">+ Crear primer módulo</button></div>
                :cursoDetalle.modulos.sort((a,b)=>a.orden-b.orden).map((mod,mi)=>(
                  <div key={mod._id} className="module-card">
                    <div className="module-header">
                      <div className="module-heading"><div className="module-number">{mi+1}</div><div><p className="module-title">{mod.titulo}</p><p className="module-count">{mod.lecciones.length} lección(es)</p></div></div>
                      <div className="module-actions"><button onClick={()=>{setModOpen(modOpen===mod._id?null:mod._id);setVistaM(null);}} className="btn-ghost" style={{display:'inline-flex',alignItems:'center',gap:5,backgroundColor:'#000',color:'#fff'}}>{modOpen===mod._id?<><ChevronUp size={14}/> Ocultar</>:<><ChevronDown size={14}/> Ver lecciones</>}</button><button onClick={()=>{setModOpen(mod._id);setFormLec({titulo:"",contenido:"",materialURL:"",duracion:0});setVistaM("addLec");setErrM("");}} className="btn-ghost-purple">+ Lección</button><button onClick={()=>handleDelMod(mod._id)} className="btn-ghost-delete"><Trash2 size={14}/></button></div>
                    </div>
                    {modOpen===mod._id&&(mod.lecciones.length===0?<p className="editor-note">Sin lecciones. Haz clic en "+ Lección" para agregar.</p>:mod.lecciones.map((lec,li)=>(
                      <div key={lec._id} className="lesson-row">
                        <div className="lesson-main">
                          <div className="lesson-number">{li+1}</div>
                          <div className="lesson-info">
                            <p className="lesson-name">{lec.titulo}</p>
                            {lec.contenido&&<p className="lesson-desc">{lec.contenido}</p>}
                            <div className="lesson-meta">
                              {lec.duracion>0&&<span className="meta-chip chip-muted" style={{display:'inline-flex',alignItems:'center',gap:4}}><Timer size={12}/> {lec.duracion} min</span>}
                              {lec.materialURL&&<a href={lec.materialURL} target="_blank" rel="noreferrer" className="meta-chip chip-link" style={{display:'inline-flex',alignItems:'center',gap:4}}><Paperclip size={12}/> Ver material</a>}
                            </div>
                          </div>
                        </div>
                        <div className="lesson-actions"><button onClick={()=>abrirEditLec(mod,lec)} className="btn-ghost" style={{display:'inline-flex',alignItems:'center',gap:5,backgroundColor:'#000',color:'#fff'}}><Pencil size={14}/> Editar</button><button onClick={()=>handleDelLec(mod._id,lec._id)} className="btn-ghost-delete"><Trash2 size={14}/></button></div>
                      </div>
                    )))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tabActiva==="tareas"&&(
          <>
            <div className="section-header">
              <div><h1 className="section-title">Gestión de Tareas</h1><p className="section-subtitle">Crea y administra tareas para tus cursos</p></div>
              {vistaT==='lista'&&<button onClick={()=>{setVistaT("crear");setErrT("");setExitoT("");}} className="btn-accent">+ Nueva Tarea</button>}
            </div>
            <div className="selector-bar"><label className="selector-label">Curso:</label><select className="form-control" value={cursoTarea} onChange={e=>{setCursoTarea(e.target.value);cargarTareas(e.target.value);setVistaT("lista");}}><option value="">Selecciona un curso</option>{cursos.map(c=><option key={c._id} value={c._id}>{c.titulo}</option>)}</select></div>
            {vistaT==='crear'&&<div className="editor-panel editor-panel-purple">
              <h3 className="editor-panel-title">Nueva tarea</h3>
              <form onSubmit={handleCrearTarea} className="form-stack">
                <div className="form-field"><label className="form-label">Título *</label><input placeholder="Ej. Tarea 1 — Análisis de datos" value={formT.titulo} onChange={e=>setFormT({...formT,titulo:e.target.value})} className="form-control"/></div>
                <div className="form-field"><label className="form-label">Descripción</label><textarea placeholder="Instrucciones para el alumno..." rows={3} value={formT.descripcion} onChange={e=>setFormT({...formT,descripcion:e.target.value})} className="form-control form-textarea"/></div>
                <div className="form-grid-2"><div className="form-field"><label className="form-label">Fecha de entrega *</label><input type="date" value={formT.fechaEntrega} onChange={e=>setFormT({...formT,fechaEntrega:e.target.value})} className="form-control"/></div><div className="form-field"><label className="form-label">Puntos</label><input type="number" min={1} max={1000} value={formT.puntos} onChange={e=>setFormT({...formT,puntos:Number(e.target.value)})} className="form-control"/></div></div>
                {errT&&<p className="form-error">{errT}</p>}{exitoT&&<p className="form-success">{exitoT}</p>}
                <div className="form-actions"><button type="button" onClick={()=>{setVistaT("lista");setErrT("");}} className="btn-secondary">Cancelar</button><button type="submit" className="btn-accent">Crear Tarea</button></div>
              </form>
            </div>}
            {vistaT==='lista'&&(!cursoTarea?<div className="empty-state"><p className="panel-empty">Selecciona un curso para ver sus tareas</p></div>
            :tareas.length===0?<div className="empty-state"><div className="empty-state-icon"><ClipboardList size={48}/></div><p className="empty-state-desc">Sin tareas en este curso</p><button onClick={()=>setVistaT("crear")} className="btn-accent">+ Crear primera tarea</button></div>
            :<div className="task-list">{tareas.map(t=><div key={t._id} className="task-item"><div className="task-info"><p className="task-title">{t.titulo}</p>{t.descripcion&&<p className="task-desc">{t.descripcion}</p>}<div className="task-meta"><span className="task-meta-item" style={{display:'inline-flex',alignItems:'center',gap:4}}><Calendar size={12}/> {new Date(t.fechaEntrega).toLocaleDateString('es-MX')}</span><span className="task-meta-points">{t.puntos} pts</span></div></div><div style={{display:'flex',alignItems:'center',gap:8}}><button onClick={()=>verEntregas(t)} className="btn-secondary" style={{display:'inline-flex',alignItems:'center',gap:5,padding:'7px 12px',fontSize:12}}><Users size={14}/> Ver entregas</button><button onClick={()=>handleDelTarea(t._id)} className="btn-delete-sm" style={{display:'inline-flex',alignItems:'center',gap:4}}><Trash2 size={14}/> Eliminar</button></div></div>)}</div>)}
          </>
        )}
      </main>
      {tareaEntregas&&<div className="modal-backdrop">
        <div className="modal-card" style={{maxWidth:640}}>
          <div className="modal-header"><h3 className="modal-title">Entregas — {tareaEntregas.titulo}</h3><button onClick={()=>setTareaEntregas(null)} className="modal-close-btn"><X size={16}/></button></div>
          <div className="modal-body">
            {errEnt&&<p className="form-error">{errEnt}</p>}
            {cargandoEnt?<p className="loading-text">Cargando entregas...</p>
            :entregas.length===0?<p className="panel-empty">Este curso no tiene alumnos inscritos.</p>
            :entregas.map(en=>(
              <div key={en.alumno.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'12px 14px',border:'1px solid var(--border-light)',borderRadius:'var(--radius-md)',background:'#fff'}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}><p style={{fontSize:13,fontWeight:600,color:'var(--text-dark)'}}>{en.alumno.nombre}</p><span className={`badge ${en.estado==='entregada'?'badge-success':en.estado==='calificada'?'badge-purple':'badge-warning'}`}>{en.estado}</span></div>
                  <p style={{fontSize:11,color:'var(--text-muted)'}}>{en.alumno.email}</p>
                  {en.entrega?.comentario&&<p style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-body)',marginTop:6}}><MessageSquare size={13}/> "{en.entrega.comentario}"</p>}
                  {en.entrega?.fechaEntrega&&<p style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--text-muted)',marginTop:4}}><Calendar size={11}/> Entregada: {new Date(en.entrega.fechaEntrega).toLocaleString('es-MX')}</p>}
                  {en.entrega?.calificacion!=null&&<p style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--purple)',fontWeight:600,marginTop:4}}><Star size={13}/> {en.entrega.calificacion}/{tareaEntregas.puntos} pts</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div> 
  );
}