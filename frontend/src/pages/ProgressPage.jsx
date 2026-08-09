import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, ClipboardList, Search, GraduationCap, Trophy, FileText, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/dashboard.css";
import "../styles/components.css";
const NAV=[{icon:Home,label:'Mis cursos',path:'/catalog'},{icon:BookOpen,label:'Mi progreso',path:'/progress'},{icon:ClipboardList,label:'Tareas',path:'/assignments'},{icon:Search,label:'Explorar',path:'/search'}];
export default function ProgressPage() {
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  const [progresos,setProgresos]=useState([]); const [resultados,setResultados]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{ Promise.all([api.get("/progreso"),api.get("/quiz/resultados/mios")]).then(([r1,r2])=>{setProgresos(r1.data);setResultados(r2.data);}).catch(console.error).finally(()=>setLoading(false)); },[]);
  const cursosComp=progresos.filter(p=>p.porcentaje===100).length;
  const quizAprobados=resultados.filter(r=>r.aprobado).length;
  const promedio=resultados.length?(resultados.reduce((a,r)=>a+r.calificacion,0)/resultados.length).toFixed(1):0;
  const stats=[{ico:BookOpen,val:progresos.length,lbl:'Cursos inscritos',sub:`${cursosComp} completados`},{ico:Trophy,val:cursosComp,lbl:'Completados',sub:'al 100%'},{ico:FileText,val:resultados.length,lbl:'Quizzes realizados',sub:`${quizAprobados} aprobados`},{ico:Star,val:promedio,lbl:'Promedio',sub:'sobre 10'}];
  const iconCls=['stat-icon-blue','stat-icon-green','stat-icon-purple','stat-icon-amber'];
  const subCls=['stat-subtext-blue','stat-subtext-green','stat-subtext-purple','stat-subtext-amber'];
  return(
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand"><div className="sidebar-logo"><GraduationCap size={18} color="#fff"/></div><p className="sidebar-title">AulaVirtual Pro</p></div>
        </div>
        <nav className="sidebar-nav">{NAV.map(item=><button key={item.path} onClick={()=>navigate(item.path)} className={`nav-item ${item.path==='/progress'?'active':''}`}><span className="nav-icon"><item.icon size={16}/></span>{item.label}</button>)}</nav>
        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">{usuario?.[0]?.toUpperCase()||'U'}</div>
            <p className="user-name">{usuario}</p>
          </div>
          <button onClick={()=>{logout();navigate("/login");}} className="btn-logout">Cerrar sesión</button>
        </div>
      </aside>
      <div className="main-content">
        <header className="page-header"><div><h1 className="page-title">Mi progreso</h1><p className="page-subtitle">Hola, {usuario}</p></div></header>
        <div className="page-body">
          {loading?<p className="loading-text">Cargando...</p>:(
            <>
              <div className="dashboard-stats">{stats.map((st,i)=><div key={st.lbl} className="stat-card"><div className={`stat-icon-box ${iconCls[i]}`}><st.ico size={20}/></div><div><p className="stat-value">{st.val}</p><p className="stat-label">{st.lbl}</p><p className={`stat-subtext ${subCls[i]}`}>{st.sub}</p></div></div>)}</div>
              <div className="panel-grid-2">
                <div className="panel-card">
                  <h3 className="panel-title">Avance por curso</h3>
                  {progresos.length===0?<p className="panel-empty">Aún no has iniciado ningún curso.</p>:progresos.map(p=><div key={p._id} className="progress-course-item" onClick={()=>navigate(`/course/${p.cursoId?._id}`)}><div className="progress-course-head"><span className="progress-course-name">{p.cursoId?.titulo}</span><span className="progress-course-pct">{p.porcentaje}%</span></div><div className="progress-track"><div className={`progress-fill ${p.porcentaje===100?'progress-fill-success':'progress-fill-primary'}`} style={{width:`${p.porcentaje}%`}}/></div></div>)}
                </div>
                <div className="panel-card">
                  <h3 className="panel-title">Historial de evaluaciones</h3>
                  {resultados.length===0?<p className="panel-empty">Aún no has realizado ningún quiz.</p>:<table className="data-table"><thead><tr>{['Quiz','Calificación','Estado'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{resultados.map(r=><tr key={r._id}><td>{r.quizId?.titulo}</td><td className="table-strong">{r.calificacion}/10</td><td><span className={`badge ${r.aprobado?'badge-success':'badge-danger'}`}>{r.aprobado?'Aprobado':'Reprobado'}</span></td></tr>)}</tbody></table>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}