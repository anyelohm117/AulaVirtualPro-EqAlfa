
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
export default function LoginPage() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [showPw,setShowPw]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const {login}=useAuth(); const navigate=useNavigate(); const location=useLocation(); const mensaje=location.state?.mensaje;
  const handleSubmit=async(e)=>{ e.preventDefault(); setError(""); if(!email||!password){setError("Completa todos los campos.");return;} setLoading(true);
    try{ const res=await api.post("/auth/login",{email,password}); login(res.data.token,res.data.usuario); const r=res.data.usuario.rol; navigate(r==="admin"?"/admin":r==="instructor"?"/teacher":"/catalog"); }
    catch(err){setError(err.response?.data?.error||"Credenciales incorrectas.");}finally{setLoading(false);} };
  const inp={width:'100%',padding:'11px 14px 11px 42px',fontSize:14,border:'1.5px solid #E2E8F0',borderRadius:10,outline:'none',color:'#0F172A',background:'#F8FAFC',fontFamily:'inherit'};
  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Inter',sans-serif"}}>
      <div style={{flex:1,background:'linear-gradient(135deg,#1E3A5C 0%,#0C2240 60%,#162040 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'3rem 2rem'}}>
        <div style={{maxWidth:400}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'2.5rem'}}>
            <div style={{width:44,height:44,background:'linear-gradient(135deg,#185FA5,#2980D4)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:'0 4px 14px rgba(24,95,165,.5)'}}>🎓</div>
            <span style={{fontSize:18,fontWeight:700,color:'#fff'}}>AulaVirtual Pro</span>
          </div>
          <h2 style={{fontSize:32,fontWeight:800,color:'#fff',lineHeight:1.2,marginBottom:16}}>Capacita a tu equipo.<br/>Impulsa resultados.</h2>
          <p style={{fontSize:14.5,color:'rgba(255,255,255,.6)',lineHeight:1.75,marginBottom:32}}>La plataforma LMS diseñada para empresas que quieren crecer.</p>
          {["Cursos organizados por módulos","Evaluaciones con calificación automática","Seguimiento de progreso en tiempo real","Panel de reportes para administradores"].map(f=>(
            <div key={f} style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <div style={{width:20,height:20,borderRadius:'50%',background:'rgba(96,165,250,.2)',border:'1px solid rgba(96,165,250,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#60A5FA',flexShrink:0}}>✓</div>
              <span style={{fontSize:13.5,color:'rgba(255,255,255,.75)'}}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{width:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'#F8FAFC'}}>
        <div style={{width:'100%',maxWidth:420,background:'#fff',borderRadius:20,padding:'2.5rem',boxShadow:'0 8px 40px rgba(0,0,0,.1)'}}>
          <h1 style={{fontSize:24,fontWeight:700,color:'#0F172A',marginBottom:4}}>Bienvenido de regreso</h1>
          <p style={{fontSize:13.5,color:'#64748B',marginBottom:24}}>Ingresa tus credenciales para continuar</p>
          {mensaje&&<div style={{padding:'10px 14px',background:'#E1F5EE',color:'#065F46',borderRadius:8,fontSize:13,marginBottom:16,border:'1px solid #A7F3D0'}}>✅ {mensaje}</div>}
          {error&&<div style={{padding:'10px 14px',background:'#FEF2F2',color:'#991B1B',borderRadius:8,fontSize:13,marginBottom:16,border:'1px solid #FECACA'}}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}} noValidate>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:13,fontWeight:500,color:'#475569'}}>Correo electrónico</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:16,pointerEvents:'none'}}>✉️</span><input type="email" placeholder="usuario@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} style={inp}/></div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:13,fontWeight:500,color:'#475569'}}>Contraseña</label>
              <div style={{position:'relative'}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:16,pointerEvents:'none'}}>🔒</span><input type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} style={{...inp,paddingRight:44}}/><button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16}}>{showPw?'🙈':'👁️'}</button></div>
            </div>
            <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:10,fontSize:15,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:4}}>
              {loading?<><span style={{width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin 1s linear infinite'}}/>Ingresando...</>:'Iniciar sesión →'}
            </button>
          </form>
          <p style={{fontSize:13,color:'#64748B',textAlign:'center',marginTop:20}}>¿No tienes cuenta? <span style={{color:'#185FA5',fontWeight:600,cursor:'pointer'}} onClick={()=>navigate("/register")}>Regístrate aquí</span></p>
          <div style={{display:'flex',alignItems:'center',gap:10,margin:'20px 0 14px',fontSize:11,color:'#94A3B8',fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}><div style={{flex:1,height:1,background:'#E2E8F0'}}/>Accesos de prueba<div style={{flex:1,height:1,background:'#E2E8F0'}}/></div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[["🛡️ Admin","admin@aulavirtual.com"],["👨‍🏫 Instructor","carlos@aulavirtual.com"],["🎓 Alumno","maria@aulavirtual.com"]].map(([r,em])=>(
              <button key={r} onClick={()=>{setEmail(em);setPassword("password123");}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 14px',background:'#F8FAFC',border:'1px solid #E2E8F0',borderRadius:8,cursor:'pointer',fontFamily:'inherit'}}>
                <span style={{fontSize:12,fontWeight:600,color:'#185FA5'}}>{r}</span><span style={{fontSize:11.5,color:'#94A3B8'}}>{em}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
