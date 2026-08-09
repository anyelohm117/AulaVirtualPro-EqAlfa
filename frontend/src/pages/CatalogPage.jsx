
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";
const NAV=[{icon:'🏠',label:'Mis cursos',path:'/catalog'},{icon:'📚',label:'Mi progreso',path:'/progress'},{icon:'📋',label:'Tareas',path:'/assignments'},{icon:'🔍',label:'Explorar',path:'/search'}];
export default function CatalogPage() {
  const [busqueda,setBusqueda]=useState(""); const [cursos,setCursos]=useState([]); const [prog,setProg]=useState({}); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  useEffect(()=>{(async()=>{ try{ const [r1,r2]=await Promise.all([api.get("/inscripciones/mis-cursos"),api.get("/progreso")]); setCursos(r1.data); const m={}; r2.data.forEach(p=>{m[p.cursoId?._id]=p.porcentaje;}); setProg(m); }catch{setError("No se pudieron cargar tus cursos.");}finally{setLoading(false);} })();},[]);
  const filtrados=cursos.filter(c=>c.titulo.toLowerCase().includes(busqueda.toLowerCase()));
  const sidebar=(
    <aside style={{width:240,background:'#1E3A5C',display:'flex',flexDirection:'column',height:'100vh',position:'sticky',top:0}}>
      <div style={{padding:'20px 18px 16px',borderBottom:'1px solid rgba(255,255,255,.08)',background:'linear-gradient(135deg,#1E3A5C,#0C2240)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,background:'linear-gradient(135deg,#185FA5,#2980D4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>🎓</div>
          <div><p style={{fontSize:13,fontWeight:700,color:'#fff'}}>AulaVirtual Pro</p><p style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>Alumno</p></div>
        </div>
      </div>
      <nav style={{flex:1,padding:'12px 10px',display:'flex',flexDirection:'column',gap:2}}>
        {NAV.map(item=><button key={item.path} onClick={()=>navigate(item.path)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background:location.pathname===item.path?'rgba(255,255,255,.12)':'none',color:location.pathname===item.path?'#fff':'rgba(255,255,255,.6)',fontSize:13.5,cursor:'pointer',fontFamily:'inherit',textAlign:'left',width:'100%'}}><span style={{fontSize:16,width:20,textAlign:'center'}}>{item.icon}</span>{item.label}</button>)}
      </nav>
      <div style={{padding:'14px 10px',borderTop:'1px solid rgba(255,255,255,.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'rgba(255,255,255,.06)',borderRadius:8,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#185FA5,#2980D4)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,flexShrink:0}}>{usuario?.[0]?.toUpperCase()||'U'}</div>
          <p style={{fontSize:13,fontWeight:500,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{usuario||'Alumno'}</p>
        </div>
        <button onClick={()=>{logout();navigate("/login");}} style={{width:'100%',padding:'8px',background:'rgba(220,38,38,.15)',border:'1px solid rgba(220,38,38,.3)',borderRadius:8,color:'#FCA5A5',fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Cerrar sesión</button>
      </div>
    </aside>
  );
  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Inter',sans-serif",background:'#F8FAFC'}}>
      {sidebar}
      <div style={{flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'0 28px',height:64,background:'#fff',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <div><h1 style={{fontSize:17,fontWeight:600,color:'#0F172A'}}>Mis cursos</h1><p style={{fontSize:12,color:'#64748B'}}>{cursos.length} curso{cursos.length!==1?'s':''} inscrito{cursos.length!==1?'s':''}</p></div>
          <div style={{position:'relative'}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:14,pointerEvents:'none'}}>🔍</span><input type="text" placeholder="Buscar..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} style={{padding:'8px 14px 8px 36px',fontSize:13,border:'1.5px solid #E2E8F0',borderRadius:10,outline:'none',background:'#F8FAFC',width:220,fontFamily:'inherit'}}/></div>
        </div>
        <div style={{flex:1,padding:'28px',overflowY:'auto'}}>
          {loading?<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60%'}}><div style={{textAlign:'center'}}><div style={{width:40,height:40,border:'3px solid #E2E8F0',borderTopColor:'#185FA5',borderRadius:'50%',margin:'0 auto 12px',animation:'spin 1s linear infinite'}}/><p style={{color:'#64748B'}}>Cargando tus cursos...</p></div></div>
          :error?<p style={{color:'#DC2626',textAlign:'center',padding:'3rem'}}>{error}</p>
          :cursos.length===0?<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'60%',textAlign:'center'}}><div style={{fontSize:60,marginBottom:16,opacity:.7}}>📚</div><h2 style={{fontSize:18,fontWeight:700,color:'#1E293B',marginBottom:8}}>Aún no tienes cursos</h2><p style={{fontSize:14,color:'#64748B',maxWidth:320,lineHeight:1.6,marginBottom:24}}>Explora el catálogo y únete a los cursos disponibles.</p><button onClick={()=>navigate("/search")} style={{padding:'11px 24px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>Explorar cursos →</button></div>
          :filtrados.length===0?<div style={{textAlign:'center',padding:'3rem'}}><p style={{color:'#64748B',fontSize:14,marginBottom:16}}>Sin resultados para "{busqueda}"</p><button onClick={()=>setBusqueda("")} style={{padding:'8px 18px',background:'#E6F1FB',color:'#185FA5',border:'none',borderRadius:8,fontSize:13,cursor:'pointer'}}>Ver todos</button></div>
          :<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20}}>
            {filtrados.map(curso=>{
              const pct=prog[curso._id]||0;
              return (
                <div key={curso._id} onClick={()=>navigate(`/course/${curso._id}`)} style={{background:'#fff',borderRadius:16,border:'1px solid #E2E8F0',overflow:'hidden',cursor:'pointer',boxShadow:'0 1px 4px rgba(0,0,0,.05)',transition:'all .2s'}}>
                  <div style={{height:140,background:curso.imagen?`url(${curso.imagen}) center/cover`:'linear-gradient(135deg,#1E3A5C,#185FA5)',position:'relative',overflow:'hidden'}}>
                    {!curso.imagen&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,opacity:.3}}>📚</div>}
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,.4),transparent 60%)'}}/>
                    <div style={{position:'absolute',bottom:10,left:12,right:12}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{height:4,flex:1,background:'rgba(255,255,255,.3)',borderRadius:99,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:'#fff',borderRadius:99}}/></div><span style={{fontSize:11,color:'#fff',fontWeight:600,flexShrink:0}}>{pct}%</span></div>
                    </div>
                  </div>
                  <div style={{padding:'14px 16px'}}>
                    <h3 style={{fontSize:14,fontWeight:600,color:'#0F172A',marginBottom:4,lineHeight:1.4}}>{curso.titulo}</h3>
                    <p style={{fontSize:12,color:'#64748B',marginBottom:12,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{curso.descripcion}</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><span style={{fontSize:11,color:'#94A3B8'}}>{curso.modulos?.length||0} módulos</span><button style={{padding:'6px 14px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:7,fontSize:12,fontWeight:500,cursor:'pointer'}}>{pct>0?'Continuar →':'Comenzar →'}</button></div>
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
