
import { useState, useEffect } from "react";
import api from "../services/api";
const iconos={youtube:'▶️',gdrive:'📄',pdf:'📕',video:'🎬',imagen:'🖼️',link:'🔗',zip:'📦'};
const labels={youtube:'Video YouTube',gdrive:'Google Drive',pdf:'PDF',video:'Video',imagen:'Imagen',link:'Enlace',zip:'ZIP'};
export default function MaterialDownload({ leccionId, cursoId }) {
  const [materiales,setMateriales]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ if(!leccionId||!cursoId){setLoading(false);return;} api.get(`/cursos/${cursoId}/lecciones/${leccionId}/materiales`).then(r=>setMateriales(r.data)).catch(()=>setMateriales([])).finally(()=>setLoading(false)); },[leccionId,cursoId]);
  if(loading||!materiales.length)return null;
  return (
    <div style={{background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:10,padding:'14px 16px'}}>
      <p style={{fontSize:13,fontWeight:600,color:'#334155',marginBottom:10}}>📎 Materiales de la lección</p>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {materiales.map(mat=>(
          <div key={mat.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',background:'#fff',border:'1px solid #E2E8F0',borderRadius:8}}>
            <span style={{fontSize:20,width:32,textAlign:'center',flexShrink:0}}>{iconos[mat.tipo]||'📎'}</span>
            <div style={{flex:1}}><p style={{fontSize:13,fontWeight:500,color:'#334155'}}>{mat.nombre}</p><p style={{fontSize:11,color:'#94A3B8',marginTop:2}}>{labels[mat.tipo]||'Archivo'}</p></div>
            {['pdf','zip','imagen','video'].includes(mat.tipo)
              ?<a href={mat.url} download target="_blank" rel="noreferrer" style={{padding:'6px 14px',background:'#185FA5',color:'#fff',borderRadius:7,fontSize:12,fontWeight:500,textDecoration:'none',whiteSpace:'nowrap'}}>⬇ Descargar</a>
              :<a href={mat.url} target="_blank" rel="noreferrer" style={{padding:'6px 14px',background:'#EFF6FF',color:'#185FA5',border:'1px solid #BFDBFE',borderRadius:7,fontSize:12,fontWeight:500,textDecoration:'none',whiteSpace:'nowrap'}}>Abrir ↗</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
