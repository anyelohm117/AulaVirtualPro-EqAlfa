
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
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
  const inp={width:'100%',padding:'11px 14px 11px 40px',fontSize:14,border:'1.5px solid #E2E8F0',borderRadius:10,outline:'none',color:'#0F172A',background:'#F8FAFC',fontFamily:'inherit'};
  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'Inter',sans-serif"}}>
      <div style={{flex:1,background:'linear-gradient(135deg,#1E3A5C 0%,#0C2240 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'3rem 2rem'}}>
        <div style={{maxWidth:380,textAlign:'center'}}>
          <div style={{width:60,height:60,background:'linear-gradient(135deg,#185FA5,#2980D4)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 24px',boxShadow:'0 4px 20px rgba(24,95,165,.5)'}}>🎓</div>
          <h2 style={{fontSize:28,fontWeight:800,color:'#fff',marginBottom:14}}>AulaVirtual Pro</h2>
          <p style={{fontSize:15,color:'rgba(255,255,255,.6)',lineHeight:1.7,marginBottom:32}}>Únete a la plataforma de capacitación empresarial de CapacitaTec S.A.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[['📚','Cursos'],['📝','Evaluaciones'],['📊','Progreso'],['🏆','Certificados']].map(([ico,txt])=>(
              <div key={txt} style={{padding:'14px 10px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:12,textAlign:'center'}}>
                <div style={{fontSize:24,marginBottom:6}}>{ico}</div><div style={{fontSize:12.5,color:'rgba(255,255,255,.65)',fontWeight:500}}>{txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{width:500,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'#F8FAFC'}}>
        <div style={{width:'100%',maxWidth:420,background:'#fff',borderRadius:20,padding:'2.5rem',boxShadow:'0 8px 40px rgba(0,0,0,.1)'}}>
          <h1 style={{fontSize:22,fontWeight:700,color:'#0F172A',marginBottom:4}}>Crear cuenta</h1>
          <p style={{fontSize:13.5,color:'#64748B',marginBottom:24}}>Regístrate como alumno y empieza a aprender hoy</p>
          {error&&<div style={{padding:'10px 14px',background:'#FEF2F2',color:'#991B1B',borderRadius:8,fontSize:13,marginBottom:16,border:'1px solid #FECACA'}}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}} noValidate>
            {[{label:'Nombre completo',type:'text',key:'nombre',ph:'Ej. María López',icon:'👤'},{label:'Correo electrónico',type:'email',key:'email',ph:'usuario@empresa.com',icon:'✉️'},{label:'Contraseña',type:'password',key:'password',ph:'Mínimo 6 caracteres',icon:'🔒'},{label:'Confirmar contraseña',type:'password',key:'confirmar',ph:'Repite tu contraseña',icon:'🔒'}].map(({label,type,key,ph,icon})=>(
              <div key={key} style={{display:'flex',flexDirection:'column',gap:5}}>
                <label style={{fontSize:13,fontWeight:500,color:'#475569'}}>{label} *</label>
                <div style={{position:'relative'}}><span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',fontSize:15,pointerEvents:'none'}}>{icon}</span><input type={type} placeholder={ph} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} style={inp}/></div>
              </div>
            ))}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#185FA5,#0C447C)',color:'#fff',border:'none',borderRadius:10,fontSize:15,fontWeight:600,cursor:'pointer',marginTop:4,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {loading?'Creando cuenta...':'Crear cuenta →'}
            </button>
          </form>
          <p style={{fontSize:13,color:'#64748B',textAlign:'center',marginTop:18}}>¿Ya tienes cuenta? <span style={{color:'#185FA5',fontWeight:600,cursor:'pointer'}} onClick={()=>navigate("/login")}>Iniciar sesión</span></p>
        </div>
      </div>
    </div>
  );
}
