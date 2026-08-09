import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/global.css";
import "../styles/auth.css";
import "../styles/components.css";
export default function RegisterPage() {
  const [f,setF]=useState({nombre:"",email:"",password:"",confirmar:""});
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const navigate=useNavigate();
  const handleSubmit=async(e)=>{ e.preventDefault(); setError("");
    if(!f.nombre||!f.email||!f.password||!f.confirmar){setError("Completa todos los campos.");return;}
    if(f.password!==f.confirmar){setError("Las contraseñas no coinciden.");return;}
    if(f.password.length<6){setError("La contraseña debe tener al menos 6 caracteres.");return;}
    setLoading(true);
    try{ await api.post("/auth/register",{nombre:f.nombre,email:f.email,password:f.password}); navigate("/login",{state:{mensaje:"Cuenta creada. Ya puedes iniciar sesión."}}); }
    catch(err){setError(err.response?.data?.error||"Error al registrar.");}finally{setLoading(false);} };
  return (
    <div className="auth-container">
      <div className="auth-hero">
        <div className="register-hero-content">
          <div className="register-hero-logo">🎓</div>
          <h2 className="register-hero-title">AulaVirtual Pro</h2>
          <p className="register-hero-desc">Únete a la plataforma de capacitación empresarial de CapacitaTec S.A.</p>
          <div className="register-grid">
            {[['📚','Cursos'],['📝','Evaluaciones'],['📊','Progreso'],['🏆','Certificados']].map(([ico,txt])=>(
              <div key={txt} className="register-feature-card">
                <div className="register-feature-icon">{ico}</div><div className="register-feature-label">{txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Regístrate como alumno y empieza a aprender hoy</p>
          {error&&<div className="auth-alert-error">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {[{label:'Nombre completo',type:'text',key:'nombre',ph:'Ej. María López',icon:'👤'},{label:'Correo electrónico',type:'email',key:'email',ph:'usuario@empresa.com',icon:'✉️'},{label:'Contraseña',type:'password',key:'password',ph:'Mínimo 6 caracteres',icon:'🔒'},{label:'Confirmar contraseña',type:'password',key:'confirmar',ph:'Repite tu contraseña',icon:'🔒'}].map(({label,type,key,ph,icon})=>(
              <div key={key} className="form-group">
                <label className="form-label">{label} *</label>
                <div className="input-icon-wrapper"><span className="input-icon">{icon}</span><input type={type} placeholder={ph} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} className="auth-input"/></div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading?'Creando cuenta...':'Crear cuenta →'}
            </button>
          </form>
          <p className="auth-footer">¿Ya tienes cuenta? <span className="auth-link" onClick={()=>navigate("/login")}>Iniciar sesión</span></p>
        </div>
      </div>
    </div>
  );
}