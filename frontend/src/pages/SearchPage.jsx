
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
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
    <div style={{background:'#fff',borderRadius:14,border:`1px solid ${inscrito?'#A7F3D0':'#E2E8F0'}`,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,.05)',opacity:inscrito?.85:1}}>
      <div style={{height:120,background:curso.imagen?`url(${curso.imagen}) center/cover`:`linear-gradient(135deg,${inscrito?'#059669,#10B981':'#1E3A5C,#185FA5'})`,position:'relative'}}>{!curso.imagen&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,opacity:.3}}>📚</div>}</div>
      <div style={{padding:'14px'}}>
        <h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:4,lineHeight:1.3}}>{curso.titulo}</h3>
        <p style={{fontSize:12,color:'#64748B',marginBottom:10,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{curso.descripcion||'Sin descripción'}</p>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:11,color:'#94A3B8'}}>{curso.modulos?.length||0} módulos</span>
          {inscrito?<button onClick={()=>navigate(`/course/${curso._id}`)} style={{padding:'7px 14px',background:'#E1F5EE',color:'#059669',border:'1px solid #A7F3D0',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>✓ Ir al curso</button>
          :<button onClick={()=>handleInscribirse(curso._id)} disabled={inscribiendo===curso._id} style={{padding:'7px 14px',background:inscribiendo===curso._id?'#E2E8F0':'linear-gradient(135deg,#185FA5,#0C447C)',color:inscribiendo===curso._id?'#94A3B8':'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>{inscribiendo===curso._id?'...':'Inscribirme'}</button>}
        </div>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:'100vh',background:'#F8FAFC',fontFamily:"'Inter',sans-serif"}}>
      <div style={{background:'#fff',borderBottom:'1px solid #E2E8F0',padding:'0 28px',height:64,display:'flex',alignItems:'center',gap:16,position:'sticky',top:0,zIndex:10}}>
        <button onClick={()=>navigate("/catalog")} style={{background:'none',border:'none',color:'#185FA5',fontSize:13.5,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>← Mis cursos</button>
        <div style={{width:1,height:20,background:'#E2E8F0'}}/><h1 style={{fontSize:16,fontWeight:600,color:'#0F172A',flex:1}}>Explorar cursos</h1>
        <div style={{position:'relative'}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:14,pointerEvents:'none'}}>🔍</span><input type="text" placeholder="Buscar cursos..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} style={{padding:'8px 14px 8px 36px',fontSize:13,border:'1.5px solid #E2E8F0',borderRadius:10,outline:'none',width:240,fontFamily:'inherit'}}/></div>
      </div>
      {msg.texto&&<div style={{margin:'16px 28px 0',padding:'11px 16px',borderRadius:10,fontSize:13,display:'flex',justifyContent:'space-between',background:msg.tipo==='ok'?'#E1F5EE':'#FEF2F2',color:msg.tipo==='ok'?'#065F46':'#991B1B',border:`1px solid ${msg.tipo==='ok'?'#A7F3D0':'#FECACA'}`}}><span>{msg.texto}</span><button onClick={()=>setMsg({texto:"",tipo:""})} style={{background:'none',border:'none',cursor:'pointer',color:'inherit'}}>✕</button></div>}
      <div style={{padding:'24px 28px'}}>
        {loading?<div style={{textAlign:'center',padding:'3rem',color:'#64748B'}}>Cargando cursos disponibles...</div>:(
          <>
            {disponibles.length>0&&<><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}><h2 style={{fontSize:15,fontWeight:600,color:'#0F172A'}}>Disponibles</h2><span style={{padding:'3px 10px',background:'#EFF6FF',color:'#185FA5',borderRadius:99,fontSize:12,fontWeight:600}}>{disponibles.length}</span></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18,marginBottom:28}}>{disponibles.map(c=><CourseCard key={c._id} curso={c} inscrito={false}/>)}</div></>}
            {inscritos.length>0&&<><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}><h2 style={{fontSize:15,fontWeight:600,color:'#0F172A'}}>Ya inscrito</h2><span style={{padding:'3px 10px',background:'#E1F5EE',color:'#059669',borderRadius:99,fontSize:12,fontWeight:600}}>{inscritos.length}</span></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:18}}>{inscritos.map(c=><CourseCard key={c._id} curso={c} inscrito={true}/>)}</div></>}
            {disponibles.length===0&&inscritos.length===0&&<div style={{textAlign:'center',padding:'4rem'}}><div style={{fontSize:48,marginBottom:14,opacity:.6}}>🔍</div><p style={{color:'#64748B',fontSize:14}}>{busqueda?`Sin resultados para "${busqueda}"`:'No hay cursos disponibles.'}</p></div>}
          </>
        )}
      </div>
    </div>
  );
}
