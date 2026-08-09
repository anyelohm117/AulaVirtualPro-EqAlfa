
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
const colorEst=e=>({entregada:{bg:'#E1F5EE',color:'#059669'},calificada:{bg:'#F5F3FF',color:'#7C3AED'},vencida:{bg:'#FEF2F2',color:'#DC2626'}}[e]||{bg:'#FFFBEB',color:'#D97706'});
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
    <div style={{minHeight:'100vh',background:'#F8FAFC',fontFamily:"'Inter',sans-serif"}}>
      {modalTarea&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(4px)',padding:'1rem'}}>
        <div style={{background:'#fff',borderRadius:20,width:'100%',maxWidth:460,boxShadow:'0 8px 40px rgba(0,0,0,.15)',overflow:'hidden'}}>
          <div style={{padding:'18px 22px',borderBottom:'1px solid #F1F5F9',display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{fontSize:15,fontWeight:600,color:'#0F172A'}}>Entregar tarea</h3><button onClick={()=>{setModalTarea(null);setComentario("");}} style={{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#94A3B8'}}>✕</button></div>
          <form onSubmit={handleEntregar} style={{padding:'22px',display:'flex',flexDirection:'column',gap:16}}>
            <div style={{padding:'12px 16px',background:'#F8FAFC',borderRadius:10,border:'1px solid #E2E8F0'}}><p style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:2}}>{modalTarea.titulo}</p><p style={{fontSize:12,color:'#64748B'}}>{modalTarea.cursoId?.titulo}</p></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}><label style={{fontSize:13,fontWeight:500,color:'#475569'}}>Comentario (opcional)</label><textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={4} placeholder="Describe tu trabajo..." style={{padding:'10px 14px',fontSize:13,border:'1.5px solid #E2E8F0',borderRadius:10,outline:'none',fontFamily:'inherit',resize:'vertical'}}/></div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button type="button" onClick={()=>{setModalTarea(null);setComentario("");}} style={{padding:'9px 20px',background:'#F1F5F9',color:'#475569',border:'none',borderRadius:10,fontSize:13.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
              <button type="submit" disabled={entregando} style={{padding:'9px 20px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:10,fontSize:13.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>{entregando?'Entregando...':'Confirmar entrega'}</button>
            </div>
          </form>
        </div>
      </div>}
      <div style={{background:'#fff',borderBottom:'1px solid #E2E8F0',padding:'0 28px',height:64,display:'flex',alignItems:'center',gap:16,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>navigate("/catalog")} style={{background:'none',border:'none',color:'#185FA5',fontSize:13.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>← Mis cursos</button>
        <div style={{width:1,height:20,background:'#E2E8F0'}}/><h1 style={{fontSize:16,fontWeight:600,color:'#0F172A',flex:1}}>Mis tareas</h1><span style={{fontSize:13,color:'#64748B'}}>{usuario}</span>
      </div>
      <div style={{padding:'24px 28px'}}>
        {msg.texto&&<div style={{padding:'11px 16px',borderRadius:10,fontSize:13,marginBottom:20,display:'flex',justifyContent:'space-between',background:msg.tipo==='ok'?'#E1F5EE':'#FEF2F2',color:msg.tipo==='ok'?'#065F46':'#991B1B',border:`1px solid ${msg.tipo==='ok'?'#A7F3D0':'#FECACA'}`}}><span>{msg.texto}</span><button onClick={()=>setMsg({texto:"",tipo:""})} style={{background:'none',border:'none',cursor:'pointer',color:'inherit'}}>✕</button></div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
          {[['📋',tareas.length,'Total'],['⏳',tareas.filter(t=>t.estado==='pendiente').length,'Pendientes'],['✅',tareas.filter(t=>['entregada','calificada'].includes(t.estado)).length,'Entregadas'],['❌',tareas.filter(t=>t.estado==='vencida').length,'Vencidas']].map(([ico,val,lbl])=>(<div key={lbl} style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}><div style={{width:42,height:42,borderRadius:12,background:'#F1F5F9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{ico}</div><div><p style={{fontSize:22,fontWeight:700,color:'#0F172A',lineHeight:1}}>{val}</p><p style={{fontSize:12,color:'#64748B',marginTop:3}}>{lbl}</p></div></div>))}
        </div>
        <div style={{display:'flex',gap:8,marginBottom:20}}>{["todas","pendientes","entregadas","vencidas"].map(f=><button key={f} onClick={()=>setFiltro(f)} style={{padding:'6px 16px',borderRadius:99,border:`1px solid ${filtro===f?'#185FA5':'#E2E8F0'}`,background:filtro===f?'#185FA5':'#fff',color:filtro===f?'#fff':'#64748B',fontSize:13,fontWeight:filtro===f?600:400,cursor:'pointer',fontFamily:'inherit'}}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}</div>
        {loading?<p style={{color:'#64748B'}}>Cargando tareas...</p>:filtradas.length===0?(<div style={{textAlign:'center',padding:'4rem',background:'#fff',borderRadius:14,border:'1px solid #E2E8F0'}}><div style={{fontSize:48,marginBottom:14,opacity:.6}}>📋</div><p style={{fontSize:15,fontWeight:600,color:'#0F172A',marginBottom:8}}>Sin tareas</p><p style={{color:'#64748B',fontSize:13.5,marginBottom:20}}>{filtro==='todas'?'Inscríbete en cursos para recibir tareas':'No hay tareas con este filtro'}</p>{filtro==='todas'&&<button onClick={()=>navigate("/search")} style={{padding:'10px 22px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:10,fontSize:14,cursor:'pointer',fontFamily:'inherit'}}>Explorar cursos</button>}</div>)
        :(<div style={{display:'flex',flexDirection:'column',gap:10}}>{filtradas.map(tarea=>{const est=colorEst(tarea.estado);const dias=diasR(tarea.fechaEntrega);return(<div key={tarea._id} style={{background:'#fff',borderRadius:14,border:'1px solid #E2E8F0',padding:'16px 20px',display:'flex',gap:16,alignItems:'flex-start',boxShadow:'0 1px 4px rgba(0,0,0,.04)'}}>
          <div style={{flex:1}}><div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><h3 style={{fontSize:14,fontWeight:600,color:'#0F172A'}}>{tarea.titulo}</h3><span style={{padding:'2px 9px',borderRadius:99,fontSize:11,fontWeight:600,background:est.bg,color:est.color,textTransform:'capitalize'}}>{tarea.estado}</span></div>
          <p style={{fontSize:12.5,color:'#185FA5',fontWeight:500,marginBottom:4}}>{tarea.cursoId?.titulo}</p>
          {tarea.descripcion&&<p style={{fontSize:12.5,color:'#64748B',marginBottom:6,lineHeight:1.5}}>{tarea.descripcion}</p>}
          {tarea.entrega?.comentario&&<p style={{fontSize:12,color:'#059669',fontStyle:'italic'}}>💬 "{tarea.entrega.comentario}"</p>}
          {tarea.entrega?.calificacion!=null&&<p style={{fontSize:12.5,fontWeight:600,color:'#7C3AED',marginTop:4}}>⭐ Calificación: {tarea.entrega.calificacion}/{tarea.puntos}</p>}</div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,flexShrink:0}}><p style={{fontSize:12,fontWeight:500,color:dias==='Vencida'?'#DC2626':dias==='Vence hoy'?'#D97706':'#475569'}}>📅 {dias}</p><p style={{fontSize:11.5,color:'#94A3B8'}}>{tarea.puntos} pts</p>{tarea.estado==='pendiente'&&<button onClick={()=>setModalTarea(tarea)} style={{padding:'7px 16px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:8,fontSize:12.5,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Entregar</button>}</div>
        </div>);})} </div>)}
      </div>
    </div>
  );
}
