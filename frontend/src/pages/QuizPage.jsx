
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
export default function QuizPage() {
  const {id:cursoId}=useParams(); const navigate=useNavigate();
  const [quiz,setQuiz]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [actual,setActual]=useState(0); const [seleccionada,setSeleccionada]=useState(null); const [respuestas,setRespuestas]=useState([]);
  const [resultado,setResultado]=useState(null); const [enviando,setEnviando]=useState(false);
  useEffect(()=>{(async()=>{ try{ const r1=await api.get(`/quiz/curso/${cursoId}`); if(!r1.data.length){setError("Este curso no tiene quiz disponible.");return;} const r2=await api.get(`/quiz/${r1.data[0]._id}`); setQuiz(r2.data); }catch{setError("No se pudo cargar el quiz.");}finally{setLoading(false);} })();},[cursoId]);
  if(loading)return(<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div style={{width:44,height:44,border:'3px solid #E2E8F0',borderTopColor:'#185FA5',borderRadius:'50%',animation:'spin 1s linear infinite'}}/></div>);
  if(error)return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',gap:16,fontFamily:"'Inter',sans-serif"}}><span style={{fontSize:48}}>📝</span><p style={{color:'#64748B',fontSize:15}}>{error}</p><button onClick={()=>navigate(-1)} style={{padding:'9px 20px',background:'#185FA5',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'inherit',fontSize:14}}>Volver al curso</button></div>);
  if(!quiz)return null;
  if(resultado){
    const ok=resultado.aprobado;
    return(<div style={{minHeight:'100vh',background:'linear-gradient(135deg,#F8FAFC,#E6F1FB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Inter',sans-serif",padding:'2rem'}}>
      <div style={{background:'#fff',borderRadius:20,padding:'3rem 2.5rem',maxWidth:460,width:'100%',textAlign:'center',boxShadow:'0 8px 40px rgba(0,0,0,.1)'}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:ok?'linear-gradient(135deg,#059669,#10B981)':'linear-gradient(135deg,#DC2626,#EF4444)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,margin:'0 auto 20px',boxShadow:ok?'0 4px 20px rgba(5,150,105,.35)':'0 4px 20px rgba(220,38,38,.35)'}}>{ok?'🏆':'📋'}</div>
        <h2 style={{fontSize:24,fontWeight:700,color:'#0F172A',marginBottom:8}}>{ok?'¡Felicitaciones!':'Sigue practicando'}</h2>
        <p style={{fontSize:14,color:'#64748B',marginBottom:24,lineHeight:1.6}}>{ok?'Has aprobado el quiz satisfactoriamente.':'Revisa el material e inténtalo de nuevo.'}</p>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:4,marginBottom:16}}><span style={{fontSize:64,fontWeight:800,color:ok?'#059669':'#DC2626',lineHeight:1}}>{resultado.calificacion}</span><span style={{fontSize:24,color:'#94A3B8'}}>/10</span></div>
        <div style={{display:'inline-block',padding:'6px 20px',borderRadius:99,background:ok?'#E1F5EE':'#FEF2F2',color:ok?'#059669':'#DC2626',fontSize:13,fontWeight:700,marginBottom:28}}>{ok?'APROBADO':'REPROBADO'}</div>
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          <button onClick={()=>navigate(`/course/${cursoId}`)} style={{padding:'10px 22px',background:'#F1F5F9',color:'#334155',border:'none',borderRadius:10,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>← Volver al curso</button>
          <button onClick={()=>navigate("/progress")} style={{padding:'10px 22px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit'}}>Ver mi progreso</button>
        </div>
      </div>
    </div>);
  }
  const pregunta=quiz.preguntas[actual]; const total=quiz.preguntas.length;
  const handleSiguiente=async()=>{
    const nuevas=[...respuestas,seleccionada];
    if(actual+1>=total){ setEnviando(true); try{const r=await api.post(`/quiz/${quiz._id}/submit`,{respuestas:nuevas});setResultado(r.data);}catch(e){setError(e.response?.data?.error||"Error al enviar.");}finally{setEnviando(false);} }
    else{setActual(a=>a+1);setSeleccionada(null);}
    if(actual+1<total) {};
  };
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#F8FAFC,#E6F1FB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Inter',sans-serif",padding:'2rem'}}>
      <div style={{background:'#fff',borderRadius:20,width:'100%',maxWidth:620,boxShadow:'0 8px 40px rgba(0,0,0,.1)',overflow:'hidden'}}>
        <div style={{height:6,background:'#F1F5F9'}}><div style={{height:'100%',width:`${((actual+1)/total)*100}%`,background:'linear-gradient(90deg,#185FA5,#2980D4)',transition:'width .4s'}}/></div>
        <div style={{padding:'20px 24px',borderBottom:'1px solid #F1F5F9',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><h2 style={{fontSize:15,fontWeight:600,color:'#0F172A'}}>{quiz.titulo}</h2><p style={{fontSize:12,color:'#64748B',marginTop:2}}>Pregunta {actual+1} de {total}</p></div>
          <div style={{display:'flex',gap:4}}>{Array.from({length:total}).map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:i<actual?'#059669':i===actual?'#185FA5':'#E2E8F0'}}/>)}</div>
        </div>
        <div style={{padding:'24px'}}>
          <p style={{fontSize:16,fontWeight:600,color:'#0F172A',lineHeight:1.5,marginBottom:20}}>{pregunta.enunciado}</p>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {pregunta.opciones.map((op,i)=>(
              <button key={i} onClick={()=>setSeleccionada(i)} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 16px',border:`2px solid ${seleccionada===i?'#185FA5':'#E2E8F0'}`,borderRadius:10,background:seleccionada===i?'#EFF6FF':'#fff',cursor:'pointer',fontFamily:'inherit',textAlign:'left',transition:'all .15s'}}>
                <div style={{width:22,height:22,borderRadius:'50%',border:`2px solid ${seleccionada===i?'#185FA5':'#CBD5E1'}`,background:seleccionada===i?'#185FA5':'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{seleccionada===i&&<div style={{width:8,height:8,borderRadius:'50%',background:'#fff'}}/>}</div>
                <span style={{fontSize:14,color:seleccionada===i?'#185FA5':'#334155',fontWeight:seleccionada===i?500:400}}>{op}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:'16px 24px',borderTop:'1px solid #F1F5F9',display:'flex',justifyContent:'flex-end'}}>
          <button onClick={handleSiguiente} disabled={seleccionada===null||enviando} style={{padding:'11px 28px',background:seleccionada===null||enviando?'#E2E8F0':'linear-gradient(135deg,#185FA5,#0C447C)',color:seleccionada===null||enviando?'#94A3B8':'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:seleccionada===null?'not-allowed':'pointer',fontFamily:'inherit'}}>
            {enviando?'Enviando...':`${actual+1===total?'Ver resultado':'Siguiente'} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
