import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/dashboard.css";
import "../styles/components.css";
const badgeCls=e=>e==='entregada'?'badge-success':e==='calificada'?'badge-purple':e==='vencida'?'badge-danger':'badge-warning';
const diasR=f=>{const d=Math.ceil((new Date(f)-new Date())/86400000);return d<0?'Vencida':d===0?'Vence hoy':`${d} día${d!==1?'s':''} restante${d!==1?'s':''}`;};
export default function AssignmentsPage() {
  const {usuario}=useAuth(); const navigate=useNavigate();
  const [tareas,setTareas]=useState([]); const [loading,setLoading]=useState(true); const [filtro,setFiltro]=useState("todas");
  const [modalTarea,setModalTarea]=useState(null); const [comentario,setComentario]=useState(""); const [entregando,setEntregando]=useState(false); const [msg,setMsg]=useState({texto:"",tipo:""});
  useEffect(()=>{ api.get("/tareas/mis-tareas").then(r=>setTareas(r.data)).catch(console.error).finally(()=>setLoading(false)); },[]);
  const handleEntregar=async(e)=>{ e.preventDefault(); setEntregando(true);
    try{ await api.post(`/tareas/${modalTarea._id}/entregar`,{comentario}); setMsg({texto:"¡Tarea entregada correctamente!",tipo:"ok"}); setModalTarea(null); setComentario(""); const r=await api.get("/tareas/mis-tareas"); setTareas(r.data); }
    catch(err){setMsg({texto:err.response?.data?.error||"Error al entregar.",tipo:"error"});}finally{setEntregando(false);} };
  const filtradas=tareas.filter(t=>filtro==="todas"?true:filtro==="pendientes"?t.estado==="pendiente":filtro==="entregadas"?["entregada","calificada"].includes(t.estado):t.estado==="vencida");
  return(
    <div className="page-container">
      {modalTarea&&<div className="modal-backdrop">
        <div className="modal-card">
          <div className="modal-header"><h3 className="modal-title">Entregar tarea</h3><button onClick={()=>{setModalTarea(null);setComentario("");}} className="modal-close-btn">✕</button></div>
          <form onSubmit={handleEntregar} className="modal-body">
            <div className="modal-info-card"><p className="modal-info-title">{modalTarea.titulo}</p><p className="modal-info-sub">{modalTarea.cursoId?.titulo}</p></div>
            <div className="form-field"><label className="form-label">Comentario (opcional)</label><textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={4} placeholder="Describe tu trabajo..." className="form-control form-textarea"/></div>
            <div className="modal-footer">
              <button type="button" onClick={()=>{setModalTarea(null);setComentario("");}} className="btn-secondary">Cancelar</button>
              <button type="submit" disabled={entregando} className="btn-action-primary">{entregando?'Entregando...':'Confirmar entrega'}</button>
            </div>
          </form>
        </div>
      </div>}
      <header className="topbar">
        <button onClick={()=>navigate("/catalog")} className="btn-back">← Mis cursos</button>
        <div className="topbar-divider"/><h1 className="topbar-title">Mis tareas</h1><span className="topbar-text">{usuario}</span>
      </header>
      <div className="page-content">
        {msg.texto&&<div className={`alert ${msg.tipo==='ok'?'alert-success':'alert-error'}`}><span>{msg.texto}</span><button onClick={()=>setMsg({texto:"",tipo:""})} className="alert-close">✕</button></div>}
        <div className="dashboard-stats">
          {[['📋',tareas.length,'Total'],['⏳',tareas.filter(t=>t.estado==='pendiente').length,'Pendientes'],['✅',tareas.filter(t=>['entregada','calificada'].includes(t.estado)).length,'Entregadas'],['❌',tareas.filter(t=>t.estado==='vencida').length,'Vencidas']].map(([ico,val,lbl])=>(<div key={lbl} className="stat-card"><div className="stat-icon-box stat-icon-neutral">{ico}</div><div><p className="stat-value">{val}</p><p className="stat-label">{lbl}</p></div></div>))}
        </div>
        <div className="filter-pills">{["todas","pendientes","entregadas","vencidas"].map(f=><button key={f} onClick={()=>setFiltro(f)} className={`filter-pill ${filtro===f?'active':''}`}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}</div>
        {loading?<p className="loading-text">Cargando tareas...</p>:filtradas.length===0?(<div className="empty-state"><div className="empty-state-icon">📋</div><p className="empty-state-title">Sin tareas</p><p className="empty-state-desc">{filtro==='todas'?'Inscríbete en cursos para recibir tareas':'No hay tareas con este filtro'}</p>{filtro==='todas'&&<button onClick={()=>navigate("/search")} className="btn-action-primary">Explorar cursos</button>}</div>)
        :(<div className="task-list">{filtradas.map(tarea=>{const dBadge=badgeCls(tarea.estado);const dias=diasR(tarea.fechaEntrega);return(<div key={tarea._id} className="assignment-card">
          <div className="assignment-info"><div className="assignment-head"><h3 className="assignment-title">{tarea.titulo}</h3><span className={`badge ${dBadge}`}>{tarea.estado}</span></div>
            <p className="assignment-course">{tarea.cursoId?.titulo}</p>
            {tarea.descripcion&&<p className="assignment-desc">{tarea.descripcion}</p>}
            {tarea.entrega?.comentario&&<p className="assignment-comment">💬 "{tarea.entrega.comentario}"</p>}
            {tarea.entrega?.calificacion!=null&&<p className="assignment-grade">⭐ Calificación: {tarea.entrega.calificacion}/{tarea.puntos}</p>}
          </div>
          <div className="assignment-side"><p className={`assignment-due ${dias==='Vencida'?'assignment-due-danger':dias==='Vence hoy'?'assignment-due-warning':''}`}>📅 {dias}</p><p className="assignment-points">{tarea.puntos} pts</p>{tarea.estado==='pendiente'&&<button onClick={()=>setModalTarea(tarea)} className="assignment-submit-btn">Entregar</button>}</div>
        </div>);})} </div>)}
      </div>
    </div>
  );
}