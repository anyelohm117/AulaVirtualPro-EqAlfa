
import { useState } from "react";
import api from "../services/api";
const detectTipo = (url) => {
  if (!url) return null;
  const u = url.toLowerCase();
  if (u.includes("youtube.com")||u.includes("youtu.be")) return "youtube";
  if (u.includes("drive.google.com")||u.includes("docs.google.com")) return "gdrive";
  if (u.match(/\.pdf$/)) return "pdf";
  if (u.match(/\.(mp4|webm|mov|ogg)$/)) return "video";
  if (u.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "imagen";
  return "link";
};
const toEmbed = (url) => { const m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/); return m?`https://www.youtube.com/embed/${m[1]}?rel=0`:url; };
const toDrive = (url) => { const m=url.match(/\/d\/([a-zA-Z0-9_-]+)/); return m?`https://drive.google.com/file/d/${m[1]}/preview`:url; };

export default function LessonViewer({ leccion, cursoId, onCompletada }) {
  const [completando,setCompletando]=useState(false);
  const [completada,setCompletada]=useState(leccion?.completada||false);
  if (!leccion) return null;
  const tipo=detectTipo(leccion.materialURL);
  const handleCompletar=async()=>{
    if(completada||completando)return;
    setCompletando(true);
    try{ await api.post(`/cursos/${cursoId}/lecciones/${leccion.id||leccion._id}/completar`); setCompletada(true); onCompletada&&onCompletada(leccion.id||leccion._id); }
    catch(e){console.error(e);}finally{setCompletando(false);}
  };
  const wrap={position:'relative',paddingBottom:'56.25%',height:0,borderRadius:12,overflow:'hidden',background:'#0F172A',boxShadow:'0 4px 20px rgba(0,0,0,.15)'};
  const ifr={position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {leccion.contenido&&<div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:10,padding:'14px 18px'}}><p style={{fontSize:14,color:'#475569',lineHeight:1.7}}>{leccion.contenido}</p></div>}
      {tipo==="youtube"&&<div style={wrap}><iframe src={toEmbed(leccion.materialURL)} style={ifr} allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowFullScreen title={leccion.titulo}/></div>}
      {tipo==="gdrive"&&<div style={{...wrap,paddingBottom:'75%',background:'#fff',border:'1px solid #E2E8F0'}}><iframe src={toDrive(leccion.materialURL)} style={ifr} title={leccion.titulo}/></div>}
      {tipo==="video"&&<video controls style={{width:'100%',borderRadius:12,background:'#000',maxHeight:480}}><source src={leccion.materialURL}/>Tu navegador no soporta video HTML5.</video>}
      {tipo==="pdf"&&<div style={{height:520,borderRadius:12,overflow:'hidden',border:'1px solid #E2E8F0'}}><iframe src={leccion.materialURL} style={{width:'100%',height:'100%',border:'none'}} title={leccion.titulo}/></div>}
      {tipo==="imagen"&&<img src={leccion.materialURL} alt={leccion.titulo} style={{width:'100%',borderRadius:12,objectFit:'contain',maxHeight:480,border:'1px solid #E2E8F0'}}/>}
      {tipo==="link"&&leccion.materialURL&&<a href={leccion.materialURL} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:10}}><span style={{fontSize:22}}>🔗</span><div><p style={{fontSize:13,fontWeight:500,color:'#185FA5'}}>Material externo</p><p style={{fontSize:11,color:'#64748B'}}>{leccion.materialURL}</p></div><span style={{marginLeft:'auto',color:'#185FA5'}}>↗</span></a>}
      {!leccion.materialURL&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'2.5rem',background:'#F8FAFC',borderRadius:10,border:'1px dashed #CBD5E1'}}><span style={{fontSize:28}}>📄</span><p style={{fontSize:13,color:'#94A3B8'}}>Esta lección no tiene material adjunto todavía.</p></div>}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:12,borderTop:'1px solid #E2E8F0'}}>
        <span style={{fontSize:12,color:'#64748B',fontWeight:500}}>{leccion.duracion>0?`⏱ ${leccion.duracion} min`:''}</span>
        <button onClick={handleCompletar} disabled={completada||completando} style={{padding:'9px 20px',background:completada?'#059669':'#185FA5',color:'#fff',border:'none',borderRadius:8,fontSize:13,fontWeight:500,cursor:completada?'default':'pointer',transition:'all .18s'}}>
          {completando?"Guardando...":completada?"✓ Lección completada":"Marcar como completada"}
        </button>
      </div>
    </div>
  );
}
