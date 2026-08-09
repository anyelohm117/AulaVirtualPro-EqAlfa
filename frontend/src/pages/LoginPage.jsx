import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/auth.css";
import "../styles/components.css";
export default function LoginPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [showPw,setShowPw]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const {login}=useAuth(); const navigate=useNavigate(); const location=useLocation(); const mensaje=location.state?.mensaje;
  const handleSubmit=async(e)=>{ e.preventDefault(); setError(""); if(!email||!password){setError("Completa todos los campos.");return;} setLoading(true);
    try{ const res=await api.post("/auth/login",{email,password}); login(res.data.token,res.data.usuario); const r=res.data.usuario.rol; navigate(r==="admin"?"/admin":r==="instructor"?"/teacher":"/catalog"); }
    catch(err){setError(err.response?.data?.error||"Credenciales incorrectas.");}finally{setLoading(false);} };
  return (
    <div className="auth-container">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-brand">
            <div className="auth-logo-badge">🎓</div>
            <span className="auth-brand-name">AulaVirtual Pro</span>
          </div>
          <h2 className="auth-hero-title">Capacita a tu equipo.<br/>Impulsa resultados.</h2>
          <p className="auth-hero-desc">La plataforma LMS diseñada para empresas que quieren crecer.</p>
          {["Cursos organizados por módulos","Evaluaciones con calificación automática","Seguimiento de progreso en tiempo real","Panel de reportes para administradores"].map(f=>(
            <div key={f} className="auth-feature-item">
              <div className="auth-feature-check">✓</div>
              <span className="auth-feature-text">{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h1 className="auth-title">Bienvenido de regreso</h1>
          <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
          {mensaje&&<div className="auth-alert-success">✅ {mensaje}</div>}
          {error&&<div className="auth-alert-error">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div className="input-icon-wrapper"><span className="input-icon">✉️</span><input type="email" placeholder="usuario@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} className="auth-input"/></div>
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-icon-wrapper"><span className="input-icon">🔒</span><input type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} className="auth-input auth-input-toggle"/><button type="button" onClick={()=>setShowPw(v=>!v)} className="password-toggle">{showPw?'🙈':'👁️'}</button></div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading?<><span className="spinner"/>Ingresando...</>:'Iniciar sesión →'}
            </button>
          </form>
          <p className="auth-footer">¿No tienes cuenta? <span className="auth-link" onClick={()=>navigate("/register")}>Regístrate aquí</span></p>
          <div className="auth-divider">Accesos de prueba</div>
          <div className="demo-login-list">
            {[["🛡️ Admin","admin@aulavirtual.com"],["👨‍🏫 Instructor","carlos@aulavirtual.com"],["🎓 Alumno","maria@aulavirtual.com"]].map(([r,em])=>(
              <button key={r} onClick={()=>{setEmail(em);setPassword("password123");}} className="demo-btn">
                <span className="demo-btn-role">{r}</span><span className="demo-btn-email">{em}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}