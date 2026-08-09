
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
export default function TeacherDashboardPage() {
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  const [cursos,setCursos]=useState([]); const [loading,setLoading]=useState(true); const [vista,setVista]=useState("lista"); const [cursoSel,setCursoSel]=useState(null); const [guardando,setGuardando]=useState(false); const [error,setError]=useState(""); const [exito,setExito]=useState(""); const [form,setForm]=useState({titulo:"",descripcion:"",imagen:""});
  const [tabActiva,setTabActiva]=useState("cursos"); const [tareas,setTareas]=useState([]); const [cursoTarea,setCursoTarea]=useState(""); const [formT,setFormT]=useState({titulo:"",descripcion:"",fechaEntrega:"",puntos:100}); const [vistaT,setVistaT]=useState("lista"); const [errT,setErrT]=useState(""); const [exitoT,setExitoT]=useState("");
  const [cursoDetalle,setCursoDetalle]=useState(null); const [modOpen,setModOpen]=useState(null); const [formMod,setFormMod]=useState({titulo:""}); const [formLec,setFormLec]=useState({titulo:"",contenido:"",materialURL:"",duracion:0}); const [vistaM,setVistaM]=useState(null); const [lecEdit,setLecEdit]=useState(null); const [errM,setErrM]=useState(""); const [guardM,setGuardM]=useState(false);
  useEffect(()=>{cargarCursos();},[]);
  const cargarCursos=async()=>{ setLoading(true); try{const r=await api.get("/cursos");setCursos(r.data);}catch{setError("Error al cargar.");}finally{setLoading(false);} };
  const cargarTareas=async(cid)=>{ if(!cid)return; try{const r=await api.get(`/tareas/curso/${cid}`);setTareas(r.data);}catch{setTareas([]);} };
  const recargarDetalle=async()=>{ if(!cursoDetalle)return; const r=await api.get(`/cursos/${cursoDetalle._id}`); setCursoDetalle(r.data); };
  const abrirEditar=(c)=>{ setForm({titulo:c.titulo,descripcion:c.descripcion||"",imagen:c.imagen||""}); setCursoSel(c); setError(""); setExito(""); setVista("editar"); };
  const abrirModulos=async(c)=>{ const r=await api.get(`/cursos/${c._id}`); setCursoDetalle(r.data); setVista("modulos"); setVistaM(null); setModOpen(null); setErrM(""); };
  const handleGuardar=async(e)=>{ e.preventDefault(); if(!form.titulo.trim()){setError("Título obligatorio.");return;} setGuardando(true); setError(""); try{ if(vista==="crear"){await api.post("/cursos",form);setExito("Curso creado ✅");}else{await api.put(`/cursos/${cursoSel._id}`,form);setExito("Curso actualizado ✅");} await cargarCursos(); setTimeout(()=>{setExito("");setVista("lista");},1500); }catch(err){setError(err.response?.data?.error||"Error.");}finally{setGuardando(false);} };
  const handleEliminar=async(c)=>{ if(!window.confirm(`¿Eliminar "${c.titulo}"?`))return; try{await api.delete(`/cursos/${c._id}`);await cargarCursos();}catch{alert("Error.");} };
  const handleAddMod=async(e)=>{ e.preventDefault(); if(!formMod.titulo){setErrM("Título obligatorio.");return;} setGuardM(true); setErrM(""); try{await api.post(`/cursos/${cursoDetalle._id}/modulos`,{titulo:formMod.titulo,orden:cursoDetalle.modulos.length+1});setFormMod({titulo:""});setVistaM(null);await recargarDetalle();}catch(err){setErrM(err.response?.data?.error||"Error.");}finally{setGuardM(false);} };
  const handleDelMod=async(mid)=>{ if(!window.confirm("¿Eliminar módulo y sus lecciones?"))return; try{await api.delete(`/cursos/${cursoDetalle._id}/modulos/${mid}`);if(modOpen===mid)setModOpen(null);await recargarDetalle();}catch{alert("Error.");} };
  const handleAddLec=async(e)=>{ e.preventDefault(); if(!formLec.titulo){setErrM("Título obligatorio.");return;} setGuardM(true); setErrM(""); try{await api.post(`/cursos/${cursoDetalle._id}/modulos/${modOpen}/lecciones`,formLec);setFormLec({titulo:"",contenido:"",materialURL:"",duracion:0});setVistaM(null);await recargarDetalle();}catch(err){setErrM(err.response?.data?.error||"Error.");}finally{setGuardM(false);} };
  const handleUpdLec=async(e)=>{ e.preventDefault(); if(!formLec.titulo){setErrM("Título obligatorio.");return;} setGuardM(true); setErrM(""); try{await api.put(`/cursos/${cursoDetalle._id}/modulos/${modOpen}/lecciones/${lecEdit._id}`,formLec);setVistaM(null);setLecEdit(null);await recargarDetalle();}catch(err){setErrM(err.response?.data?.error||"Error.");}finally{setGuardM(false);} };
  const handleDelLec=async(mid,lid)=>{ if(!window.confirm("¿Eliminar lección?"))return; try{await api.delete(`/cursos/${cursoDetalle._id}/modulos/${mid}/lecciones/${lid}`);await recargarDetalle();}catch{alert("Error.");} };
  const abrirEditLec=(mod,lec)=>{ setModOpen(mod._id); setLecEdit(lec); setFormLec({titulo:lec.titulo,contenido:lec.contenido||"",materialURL:lec.materialURL||"",duracion:lec.duracion||0}); setVistaM("editLec"); setErrM(""); };
  const handleCrearTarea=async(e)=>{ e.preventDefault(); if(!formT.titulo||!formT.fechaEntrega||!cursoTarea){setErrT("Completa todos los campos.");return;} try{await api.post("/tareas",{...formT,cursoId:cursoTarea});setExitoT("Tarea creada ✅");setFormT({titulo:"",descripcion:"",fechaEntrega:"",puntos:100});await cargarTareas(cursoTarea);setTimeout(()=>{setExitoT("");setVistaT("lista");},1500);}catch(err){setErrT(err.response?.data?.error||"Error.");} };
  const handleDelTarea=async(id)=>{ if(!window.confirm("¿Eliminar tarea?"))return; try{await api.delete(`/tareas/${id}`);await cargarTareas(cursoTarea);}catch{alert("Error.");} };
  const cambiarTab=(t)=>{ setTabActiva(t); setVista("lista"); if(t==="tareas"&&cursos.length>0){const cid=cursos[0]._id;setCursoTarea(cid);cargarTareas(cid);} };
  const inp={padding:'10px 12px',fontSize:13,border:'1.5px solid #E2E8F0',borderRadius:10,outline:'none',fontFamily:'inherit',color:'#334155',width:'100%',boxSizing:'border-box'};
  const btnP={padding:'10px 20px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'};
  const btnS={padding:'10px 20px',background:'#fff',color:'#334155',border:'1px solid #d1d5db',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'inherit'};
  return(
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Inter',sans-serif",background:'#F8FAFC'}}>
      <aside style={{width:240,background:'#1E3A5C',display:'flex',flexDirection:'column',height:'100vh',position:'sticky',top:0}}>
        <div style={{padding:'20px 18px 16px',borderBottom:'1px solid rgba(255,255,255,.08)',background:'linear-gradient(135deg,#1E3A5C,#0C2240)'}}><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:36,height:36,background:'linear-gradient(135deg,#185FA5,#2980D4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🎓</div><div><p style={{fontSize:13,fontWeight:700,color:'#fff'}}>AulaVirtual Pro</p><p style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Instructor</p></div></div></div>
        <nav style={{flex:1,padding:'12px 10px',display:'flex',flexDirection:'column',gap:2}}>{[['📚','Mis Cursos','cursos'],['📋','Tareas','tareas']].map(([ico,lbl,t])=><button key={t} onClick={()=>cambiarTab(t)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background:tabActiva===t?'rgba(255,255,255,.12)':'none',color:tabActiva===t?'#fff':'rgba(255,255,255,.6)',fontSize:13.5,cursor:'pointer',fontFamily:'inherit',textAlign:'left',width:'100%',fontWeight:tabActiva===t?500:400}}><span style={{fontSize:16,width:20,textAlign:'center'}}>{ico}</span>{lbl}</button>)}</nav>
        <div style={{padding:'14px 10px',borderTop:'1px solid rgba(255,255,255,.08)'}}><div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,.06)',borderRadius:8,marginBottom:8}}><div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#185FA5,#2980D4)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,flexShrink:0}}>{usuario?.[0]?.toUpperCase()||'P'}</div><div><p style={{fontSize:13,fontWeight:500,color:'#fff'}}>{usuario||'Profesor'}</p><p style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Instructor</p></div></div><button onClick={()=>{logout();navigate("/login");}} style={{width:'100%',padding:'8px',background:'rgba(220,38,38,.15)',border:'1px solid rgba(220,38,38,.3)',borderRadius:8,color:'#FCA5A5',fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Cerrar sesión</button></div>
      </aside>
      <main style={{flex:1,padding:'32px',overflowY:'auto'}}>
        {tabActiva==="cursos"&&(
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
              <div><h1 style={{fontSize:22,fontWeight:700,color:'#0F172A'}}>{vista==='lista'?'Mis Cursos':vista==='crear'?'Crear Curso':vista==='editar'?'Editar Curso':'📚 '+cursoDetalle?.titulo}</h1><p style={{fontSize:13,color:'#64748B',marginTop:4}}>{vista==='lista'?`${cursos.length} curso(s)`:vista==='modulos'?`${cursoDetalle?.modulos?.length||0} módulos · ${cursoDetalle?.modulos?.reduce((a,m)=>a+m.lecciones.length,0)||0} lecciones`:''}</p></div>
              <div style={{display:'flex',gap:8}}>
                {vista==='lista'&&<button onClick={()=>{setForm({titulo:"",descripcion:"",imagen:""});setCursoSel(null);setError("");setExito("");setVista("crear");}} style={btnP}>+ Nuevo Curso</button>}
                {vista==='modulos'&&<><button onClick={()=>{setVista("lista");setCursoDetalle(null);}} style={btnS}>← Volver</button><button onClick={()=>{setVistaM("addMod");setErrM("");}} style={{...btnP,background:'linear-gradient(135deg,#7C3AED,#6D28D9)'}}>+ Módulo</button></>}
                {(vista==='crear'||vista==='editar')&&<button onClick={()=>{setVista("lista");setError("");setExito("");}} style={btnS}>Cancelar</button>}
              </div>
            </div>
            {vista==='lista'&&(
              <>
                {loading&&<p style={{color:'#64748B'}}>Cargando cursos...</p>}
                {error&&<p style={{color:'#DC2626',fontSize:13}}>{error}</p>}
                {!loading&&cursos.length===0&&<div style={{textAlign:'center',padding:'4rem',background:'#fff',borderRadius:14,border:'1px solid #E2E8F0'}}><div style={{fontSize:48,marginBottom:12,opacity:.5}}>📚</div><p style={{color:'#64748B',marginBottom:16}}>Aún no has creado cursos</p><button onClick={()=>{setForm({titulo:"",descripcion:"",imagen:""});setCursoSel(null);setVista("crear");}} style={btnP}>Crear primer curso</button></div>}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
                  {cursos.map(c=>(
                    <div key={c._id} style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.05)'}}>
                      <div style={{height:130,background:c.imagen?`url(${c.imagen}) center/cover`:'linear-gradient(135deg,#1E3A5C,#185FA5)',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>{!c.imagen&&<span style={{fontSize:44,opacity:.3}}>📚</span>}<div style={{position:'absolute',top:10,right:10}}><span style={{padding:'3px 10px',borderRadius:99,fontSize:11,fontWeight:600,background:c.activo?'#E1F5EE':'#FEF2F2',color:c.activo?'#059669':'#DC2626'}}>{c.activo?'Activo':'Inactivo'}</span></div></div>
                      <div style={{padding:'14px 16px'}}>
                        <h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:4}}>{c.titulo}</h3>
                        <p style={{fontSize:12,color:'#64748B',marginBottom:10,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{c.descripcion||'Sin descripción'}</p>
                        <div style={{display:'flex',gap:6}}><button onClick={()=>abrirEditar(c)} style={{flex:1,padding:'7px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',color:'#334155',fontFamily:'inherit'}}>✏️ Editar</button><button onClick={()=>abrirModulos(c)} style={{flex:1,padding:'7px',background:'#F5F3FF',border:'1px solid #DDD6FE',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',color:'#7C3AED',fontFamily:'inherit'}}>📚 Módulos</button><button onClick={()=>handleEliminar(c)} style={{padding:'7px 10px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:8,fontSize:12,cursor:'pointer',color:'#DC2626',fontFamily:'inherit'}}>🗑️</button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {(vista==='crear'||vista==='editar')&&(
              <div style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',padding:'28px',maxWidth:600}}>
                <form onSubmit={handleGuardar} style={{display:'flex',flexDirection:'column',gap:18}}>
                  {[{label:'Título del curso *',key:'titulo',ph:'Ej. Excel para Negocios'},{label:'Descripción',key:'descripcion',ph:'Describe el contenido del curso...',area:true},{label:'URL de imagen de portada',key:'imagen',ph:'https://ejemplo.com/imagen.jpg',type:'url'}].map(f=>(<div key={f.key} style={{display:'flex',flexDirection:'column',gap:6}}><label style={{fontSize:13,fontWeight:500,color:'#475569'}}>{f.label}</label>{f.area?<textarea placeholder={f.ph} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{...inp,minHeight:90,resize:'vertical'}}/>:<input type={f.type||'text'} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={inp}/>}{f.key==='imagen'&&form.imagen&&<img src={form.imagen} alt="preview" style={{marginTop:8,width:'100%',maxHeight:140,objectFit:'cover',borderRadius:10,border:'1px solid #E2E8F0'}} onError={e=>e.target.style.display='none'}/>}</div>))}
                  {error&&<p style={{fontSize:13,color:'#DC2626'}}>{error}</p>}{exito&&<p style={{fontSize:13,color:'#059669'}}>{exito}</p>}
                  <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}><button type="button" onClick={()=>{setVista("lista");setError("");setExito("");}} style={btnS}>Cancelar</button><button type="submit" disabled={guardando} style={btnP}>{guardando?'Guardando...':vista==='crear'?'Crear Curso':'Guardar Cambios'}</button></div>
                </form>
              </div>
            )}
            {vista==='modulos'&&cursoDetalle&&(
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {vistaM==='addMod'&&<div style={{background:'#fff',borderRadius:14,border:'2px solid #7C3AED',padding:'20px',marginBottom:4}}><h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:14}}>Nuevo módulo</h3><form onSubmit={handleAddMod} style={{display:'flex',gap:10,alignItems:'flex-end'}}><div style={{flex:1}}><label style={{fontSize:12,fontWeight:500,color:'#475569',display:'block',marginBottom:5}}>Título *</label><input style={inp} placeholder="Ej. Fundamentos básicos" value={formMod.titulo} onChange={e=>setFormMod({titulo:e.target.value})}/></div><button type="submit" disabled={guardM} style={{...btnP,background:'linear-gradient(135deg,#7C3AED,#6D28D9)',padding:'10px 18px',whiteSpace:'nowrap'}}>{guardM?'Guardando...':'Agregar'}</button><button type="button" onClick={()=>setVistaM(null)} style={{...btnS,padding:'10px 14px'}}>Cancelar</button></form>{errM&&<p style={{fontSize:12,color:'#DC2626',marginTop:8}}>{errM}</p>}</div>}
                {(vistaM==='addLec'||vistaM==='editLec')&&<div style={{background:'#fff',borderRadius:14,border:'2px solid #185FA5',padding:'20px',marginBottom:4}}><h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:14}}>{vistaM==='addLec'?'Nueva lección':`Editando: ${lecEdit?.titulo}`}</h3><form onSubmit={vistaM==='addLec'?handleAddLec:handleUpdLec} style={{display:'flex',flexDirection:'column',gap:14}}>{[{label:'Título *',key:'titulo',ph:'Ej. Introducción al tema'},{label:'Contenido/descripción',key:'contenido',ph:'Describe de qué trata esta lección...',area:true},{label:'URL del material (YouTube, Drive, PDF...)',key:'materialURL',ph:'https://youtube.com/watch?v=... o https://drive.google.com/...'}].map(f=><div key={f.key} style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:12,fontWeight:500,color:'#475569'}}>{f.label}</label>{f.area?<textarea placeholder={f.ph} value={formLec[f.key]} onChange={e=>setFormLec({...formLec,[f.key]:e.target.value})} style={{...inp,minHeight:70,resize:'vertical'}}/>:<input type="text" placeholder={f.ph} value={formLec[f.key]} onChange={e=>setFormLec({...formLec,[f.key]:e.target.value})} style={inp}/>}</div>)}<div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:12,fontWeight:500,color:'#475569'}}>Duración (minutos)</label><input type="number" min={0} value={formLec.duracion} onChange={e=>setFormLec({...formLec,duracion:Number(e.target.value)})} style={{...inp,width:140}}/></div>{errM&&<p style={{fontSize:12,color:'#DC2626'}}>{errM}</p>}<div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button type="button" onClick={()=>{setVistaM(null);setLecEdit(null);setErrM("");}} style={btnS}>Cancelar</button><button type="submit" disabled={guardM} style={btnP}>{guardM?'Guardando...':vistaM==='addLec'?'Agregar lección':'Guardar cambios'}</button></div></form></div>}
                {cursoDetalle.modulos.length===0?<div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:14,border:'1px solid #E2E8F0'}}><div style={{fontSize:44,marginBottom:12,opacity:.5}}>📦</div><p style={{color:'#64748B',marginBottom:16}}>Sin módulos todavía</p><button onClick={()=>setVistaM("addMod")} style={{...btnP,background:'linear-gradient(135deg,#7C3AED,#6D28D9)'}}>+ Crear primer módulo</button></div>
                :cursoDetalle.modulos.sort((a,b)=>a.orden-b.orden).map((mod,mi)=>(
                  <div key={mod._id} style={{background:'#fff',borderRadius:12,border:'1px solid #E2E8F0',overflow:'hidden'}}>
                    <div style={{padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#F8FAFC',borderBottom:'1px solid #E2E8F0'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:24,height:24,borderRadius:'50%',background:'#7C3AED',color:'#fff',fontSize:12,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{mi+1}</div><div><p style={{fontSize:13,fontWeight:600,color:'#0F172A'}}>{mod.titulo}</p><p style={{fontSize:11,color:'#94A3B8'}}>{mod.lecciones.length} lección(es)</p></div></div>
                      <div style={{display:'flex',gap:6}}><button onClick={()=>{setModOpen(modOpen===mod._id?null:mod._id);setVistaM(null);}} style={{padding:'5px 10px',background:'#fff',border:'1px solid #E2E8F0',borderRadius:6,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>{modOpen===mod._id?'▲ Ocultar':'▼ Ver lecciones'}</button><button onClick={()=>{setModOpen(mod._id);setFormLec({titulo:"",contenido:"",materialURL:"",duracion:0});setVistaM("addLec");setErrM("");}} style={{padding:'5px 10px',background:'#F5F3FF',border:'1px solid #DDD6FE',borderRadius:6,fontSize:11,cursor:'pointer',fontFamily:'inherit',color:'#7C3AED'}}>+ Lección</button><button onClick={()=>handleDelMod(mod._id)} style={{padding:'5px 8px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:6,fontSize:12,cursor:'pointer',color:'#DC2626',fontFamily:'inherit'}}>🗑️</button></div>
                    </div>
                    {modOpen===mod._id&&(mod.lecciones.length===0?<p style={{fontSize:12,color:'#9CA3AF',padding:'12px 16px',fontStyle:'italic'}}>Sin lecciones. Haz clic en "+ Lección" para agregar.</p>:mod.lecciones.map((lec,li)=>(
                      <div key={lec._id} style={{padding:'10px 16px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,borderBottom:'1px solid #F8FAFC'}}>
                        <div style={{display:'flex',alignItems:'flex-start',gap:10,flex:1}}>
                          <div style={{width:20,height:20,borderRadius:'50%',background:'#E6F1FB',color:'#185FA5',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>{li+1}</div>
                          <div style={{flex:1}}>
                            <p style={{fontSize:13,fontWeight:500,color:'#0F172A'}}>{lec.titulo}</p>
                            {lec.contenido&&<p style={{fontSize:12,color:'#64748B',marginTop:2,lineHeight:1.4}}>{lec.contenido}</p>}
                            <div style={{display:'flex',gap:10,marginTop:4,flexWrap:'wrap'}}>
                              {lec.duracion>0&&<span style={{fontSize:11,color:'#64748B',background:'#F1F5F9',padding:'2px 8px',borderRadius:99}}>⏱ {lec.duracion} min</span>}
                              {lec.materialURL&&<a href={lec.materialURL} target="_blank" rel="noreferrer" style={{fontSize:11,color:'#185FA5',background:'#EFF6FF',padding:'2px 8px',borderRadius:99,textDecoration:'none'}}>📎 Ver material</a>}
                            </div>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:6,flexShrink:0}}><button onClick={()=>abrirEditLec(mod,lec)} style={{padding:'5px 10px',background:'#F1F5F9',border:'1px solid #E2E8F0',borderRadius:6,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>✏️ Editar</button><button onClick={()=>handleDelLec(mod._id,lec._id)} style={{padding:'5px 8px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:6,fontSize:12,cursor:'pointer',color:'#DC2626',fontFamily:'inherit'}}>🗑️</button></div>
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
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div><h1 style={{fontSize:22,fontWeight:700,color:'#0F172A'}}>Gestión de Tareas</h1><p style={{fontSize:13,color:'#64748B',marginTop:4}}>Crea y administra tareas para tus cursos</p></div>
              {vistaT==='lista'&&<button onClick={()=>{setVistaT("crear");setErrT("");setExitoT("");}} style={{...btnP,background:'linear-gradient(135deg,#7C3AED,#6D28D9)'}}>+ Nueva Tarea</button>}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#fff',borderRadius:10,border:'1px solid #E2E8F0',marginBottom:20}}><label style={{fontSize:13,fontWeight:500,color:'#334155'}}>Curso:</label><select style={{...inp,flex:1,width:'auto'}} value={cursoTarea} onChange={e=>{setCursoTarea(e.target.value);cargarTareas(e.target.value);setVistaT("lista");}}><option value="">Selecciona un curso</option>{cursos.map(c=><option key={c._id} value={c._id}>{c.titulo}</option>)}</select></div>
            {vistaT==='crear'&&<div style={{background:'#fff',borderRadius:14,border:'2px solid #7C3AED',padding:'24px',maxWidth:600,marginBottom:20}}>
              <h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:16}}>Nueva tarea</h3>
              <form onSubmit={handleCrearTarea} style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:12,fontWeight:500,color:'#475569'}}>Título *</label><input placeholder="Ej. Tarea 1 — Análisis de datos" value={formT.titulo} onChange={e=>setFormT({...formT,titulo:e.target.value})} style={inp}/></div>
                <div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:12,fontWeight:500,color:'#475569'}}>Descripción</label><textarea placeholder="Instrucciones para el alumno..." rows={3} value={formT.descripcion} onChange={e=>setFormT({...formT,descripcion:e.target.value})} style={{...inp,resize:'vertical'}}/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:12,fontWeight:500,color:'#475569'}}>Fecha de entrega *</label><input type="date" value={formT.fechaEntrega} onChange={e=>setFormT({...formT,fechaEntrega:e.target.value})} style={inp}/></div><div style={{display:'flex',flexDirection:'column',gap:5}}><label style={{fontSize:12,fontWeight:500,color:'#475569'}}>Puntos</label><input type="number" min={1} max={1000} value={formT.puntos} onChange={e=>setFormT({...formT,puntos:Number(e.target.value)})} style={inp}/></div></div>
                {errT&&<p style={{fontSize:12,color:'#DC2626'}}>{errT}</p>}{exitoT&&<p style={{fontSize:12,color:'#059669'}}>{exitoT}</p>}
                <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button type="button" onClick={()=>{setVistaT("lista");setErrT("");}} style={btnS}>Cancelar</button><button type="submit" style={{...btnP,background:'linear-gradient(135deg,#7C3AED,#6D28D9)'}}>Crear Tarea</button></div>
              </form>
            </div>}
            {vistaT==='lista'&&(!cursoTarea?<div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:14,border:'1px solid #E2E8F0'}}><p style={{color:'#94A3B8'}}>Selecciona un curso para ver sus tareas</p></div>
            :tareas.length===0?<div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:14,border:'1px solid #E2E8F0'}}><div style={{fontSize:44,marginBottom:12,opacity:.5}}>📋</div><p style={{color:'#64748B',marginBottom:16}}>Sin tareas en este curso</p><button onClick={()=>setVistaT("crear")} style={{...btnP,background:'linear-gradient(135deg,#7C3AED,#6D28D9)'}}>+ Crear primera tarea</button></div>
            :<div style={{display:'flex',flexDirection:'column',gap:10}}>{tareas.map(t=><div key={t._id} style={{background:'#fff',borderRadius:10,border:'1px solid #E2E8F0',padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><div style={{flex:1}}><p style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:4}}>{t.titulo}</p>{t.descripcion&&<p style={{fontSize:12,color:'#64748B',marginBottom:4}}>{t.descripcion}</p>}<div style={{display:'flex',gap:12}}><span style={{fontSize:11,color:'#64748B'}}>📅 {new Date(t.fechaEntrega).toLocaleDateString('es-MX')}</span><span style={{fontSize:11,color:'#7C3AED',fontWeight:600}}>{t.puntos} pts</span></div></div><button onClick={()=>handleDelTarea(t._id)} style={{padding:'6px 12px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:7,fontSize:12,fontWeight:600,cursor:'pointer',color:'#DC2626',fontFamily:'inherit'}}>🗑️ Eliminar</button></div>)}</div>)}
          </>
        )}
      </main>
    </div> 
  );
}
