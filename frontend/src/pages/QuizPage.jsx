import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/global.css";
import "../styles/courses.css";
import "../styles/components.css";
export default function QuizPage() {
  const {id:cursoId}=useParams(); const navigate=useNavigate();
  const [quiz,setQuiz]=useState(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const [actual,setActual]=useState(0); const [seleccionada,setSeleccionada]=useState(null); const [respuestas,setRespuestas]=useState([]);
  const [resultado,setResultado]=useState(null); const [enviando,setEnviando]=useState(false);
  useEffect(()=>{(async()=>{ try{ const r1=await api.get(`/quiz/curso/${cursoId}`); if(!r1.data.length){setError("Este curso no tiene quiz disponible.");return;} const r2=await api.get(`/quiz/${r1.data[0]._id}`); setQuiz(r2.data); }catch{setError("No se pudo cargar el quiz.");}finally{setLoading(false);} })();},[cursoId]);
  if(loading)return(<div className="loading-screen"><div className="spinner-large"/></div>);
  if(error)return(<div className="quiz-error"><span className="quiz-error-icon">📝</span><p className="quiz-error-text">{error}</p><button onClick={()=>navigate(-1)} className="btn-action-primary">Volver al curso</button></div>);
  if(!quiz)return null;
  if(resultado){
    const ok=resultado.aprobado;
    return(<div className="quiz-container">
      <div className="quiz-result-card">
        <div className={`quiz-result-icon ${ok?'quiz-result-icon-success':'quiz-result-icon-fail'}`}>{ok?'🏆':'📋'}</div>
        <h2 className="quiz-result-title">{ok?'¡Felicitaciones!':'Sigue practicando'}</h2>
        <p className="quiz-result-desc">{ok?'Has aprobado el quiz satisfactoriamente.':'Revisa el material e inténtalo de nuevo.'}</p>
        <div className="quiz-result-grade"><span className={`quiz-result-grade-value ${ok?'quiz-result-grade-success':'quiz-result-grade-fail'}`}>{resultado.calificacion}</span><span className="quiz-result-grade-total">/10</span></div>
        <div className={`quiz-result-badge ${ok?'quiz-result-badge-success':'quiz-result-badge-fail'}`}>{ok?'APROBADO':'REPROBADO'}</div>
        <div className="quiz-result-actions">
          <button onClick={()=>navigate(`/course/${cursoId}`)} className="btn-secondary">← Volver al curso</button>
          <button onClick={()=>navigate("/progress")} className="btn-action-primary">Ver mi progreso</button>
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
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-progress"><div className="quiz-progress-fill" style={{width:`${((actual+1)/total)*100}%`}}/></div>
        <div className="quiz-header">
          <div><h2 className="quiz-title">{quiz.titulo}</h2><p className="quiz-subtitle">Pregunta {actual+1} de {total}</p></div>
          <div className="quiz-dots">{Array.from({length:total}).map((_,i)=><div key={i} className={`quiz-dot ${i<actual?'quiz-dot-done':i===actual?'quiz-dot-active':'quiz-dot-pending'}`}/>)}</div>
        </div>
        <div className="quiz-body">
          <p className="quiz-question">{pregunta.enunciado}</p>
          <div className="quiz-options">
            {pregunta.opciones.map((op,i)=>(
              <button key={i} onClick={()=>setSeleccionada(i)} className={`quiz-option-btn ${seleccionada===i?'selected':''}`}>
                <div className="quiz-radio">{seleccionada===i&&<div className="quiz-radio-dot"/>}</div>
                <span className="quiz-option-text">{op}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-footer">
          <button onClick={handleSiguiente} disabled={seleccionada===null||enviando} className="quiz-next-btn">
            {enviando?'Enviando...':`${actual+1===total?'Ver resultado':'Siguiente'} →`}
          </button>
        </div>
      </div>
    </div>
  );
}