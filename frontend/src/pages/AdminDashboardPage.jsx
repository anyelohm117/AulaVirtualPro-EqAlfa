import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Users, BookOpen, BarChart3, Presentation, User, Lock, Unlock, Trash2, GraduationCap } from "lucide-react";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/global.css";
import "../styles/layout.css";
import "../styles/dashboard.css";
import "../styles/components.css";
const CHART={primary:"#185FA5",purple:"#7C3AED",success:"#059669",danger:"#DC2626",muted:"#64748B",body:"#334155",subtle:"#F1F5F9"};
export default function AdminDashboardPage() {
  const {usuario,logout}=useAuth(); const navigate=useNavigate();
  const [tab,setTab]=useState("usuarios"); const [usuarios,setUsuarios]=useState([]); const [cursos,setCursos]=useState([]); const [reporte,setReporte]=useState([]); const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false); const [formN,setFormN]=useState({nombre:"",email:"",password:"",rol:"instructor"}); const [errForm,setErrForm]=useState(""); const [guardando,setGuardando]=useState(false);
  const cargar=async()=>{ const [r1,r2,r3]=await Promise.all([api.get("/usuarios"),api.get("/cursos"),api.get("/reportes/admin")]); setUsuarios(r1.data);setCursos(r2.data);setReporte(r3.data); };
  useEffect(()=>{cargar().catch(console.error).finally(()=>setLoading(false));},[]);
  const totalUsuarios=usuarios.length;
  const totalAlumnos=usuarios.filter(u=>u.rol==='alumno').length;
  const totalInstructores=usuarios.filter(u=>u.rol==='instructor').length;
  const totalCursos=cursos.length;
  const cursosActivos=cursos.filter(c=>c.activo).length;
  const pctAlumnos=totalUsuarios?Math.round((totalAlumnos/totalUsuarios)*100):0;
  const pctInstructores=totalUsuarios?Math.round((totalInstructores/totalUsuarios)*100):0;
  const pctCursosActivos=totalCursos?Math.round((cursosActivos/totalCursos)*100):0;
  const progresoPorCurso=useMemo(()=>{const acc={};reporte.forEach(r=>(r.progresos||[]).forEach(p=>{if(!p.curso)return;acc[p.curso]=acc[p.curso]||{suma:0,n:0};acc[p.curso].suma+=Number(p.porcentaje)||0;acc[p.curso].n+=1;}));return Object.entries(acc).map(([curso,v])=>({curso,promedio:Math.round(v.suma/v.n)})).sort((a,b)=>b.promedio-a.promedio);},[reporte]);
  const califPorQuiz=useMemo(()=>{const acc={};reporte.forEach(r=>(r.calificaciones||[]).forEach(c=>{if(!c.quiz)return;acc[c.quiz]=acc[c.quiz]||{suma:0,n:0};acc[c.quiz].suma+=Number(c.calificacion)||0;acc[c.quiz].n+=1;}));return Object.entries(acc).map(([quiz,v])=>({quiz,promedio:Math.round((v.suma/v.n)*10)/10})).sort((a,b)=>b.promedio-a.promedio).slice(0,8);},[reporte]);
  const donutAprob=useMemo(()=>{const total=reporte.reduce((a,r)=>a+(r.calificaciones||[]).length,0);const aprob=reporte.reduce((a,r)=>a+(r.calificaciones||[]).filter(c=>c.aprobado).length,0);return{total,aprob,noAprob:total-aprob,pct:total?Math.round((aprob/total)*100):0};},[reporte]);
  const handleToggle=async(id)=>{try{await api.patch(`/usuarios/${id}/estado`);await cargar();}catch{alert("Error");}};
  const handleDelU=async(id)=>{if(!window.confirm("¿Eliminar?"))return;try{await api.delete(`/usuarios/${id}`);await cargar();}catch{alert("Error");}};
  const handleDelC=async(id)=>{if(!window.confirm("¿Desactivar?"))return;try{await api.delete(`/cursos/${id}`);await cargar();}catch{alert("Error");}};
  const handleCrear=async(e)=>{ e.preventDefault();setErrForm(""); if(!formN.nombre||!formN.email||!formN.password){setErrForm("Todos los campos son obligatorios.");return;} setGuardando(true);
    try{await api.post("/usuarios",formN);setModal(false);setFormN({nombre:"",email:"",password:"",rol:"instructor"});await cargar();}catch(err){setErrForm(err.response?.data?.error||"Error al crear.");}finally{setGuardando(false);} };
  const rcCls=r=>({admin:'badge-danger',instructor:'badge-primary',alumno:'badge-neutral'}[r]||'badge-neutral');
  const TH=({c})=><th>{c}</th>;
  const TD=({c,strong})=><td className={strong?'table-strong':''}>{c}</td>;
  return(
    <div className="app-layout">
      {modal&&<div className="modal-backdrop">
        <div className="modal-card">
          <div className="modal-header"><h3 className="modal-title">Nuevo usuario</h3><button onClick={()=>setModal(false)} className="modal-close-btn"><X size={16}/></button></div>
          <form onSubmit={handleCrear} className="modal-body">
            {[{l:'Nombre',t:'text',k:'nombre',p:'Nombre completo'},{l:'Email',t:'email',k:'email',p:'correo@empresa.com'},{l:'Contraseña',t:'password',k:'password',p:'Mínimo 6 caracteres'}].map(f=>(<div key={f.k} className="form-field"><label className="form-label">{f.l}</label><input type={f.t} placeholder={f.p} value={formN[f.k]} onChange={e=>setFormN({...formN,[f.k]:e.target.value})} className="form-control"/></div>))}
            <div className="form-field"><label className="form-label">Rol</label><select value={formN.rol} onChange={e=>setFormN({...formN,rol:e.target.value})} className="form-control"><option value="alumno">Alumno</option><option value="instructor">Instructor</option><option value="admin">Administrador</option></select></div>
            {errForm&&<p className="form-error">{errForm}</p>}
            <div className="modal-footer"><button type="button" onClick={()=>setModal(false)} className="btn-secondary">Cancelar</button><button type="submit" disabled={guardando} className="btn-action-primary">{guardando?'Creando...':'Crear usuario'}</button></div>
          </form>
        </div>
      </div>}
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="sidebar-logo"><GraduationCap size={18} color="#fff"/></div><div><p className="sidebar-title">AulaVirtual Pro</p><p className="sidebar-role">Administrador</p></div></div></div>
        <nav className="sidebar-nav">{[[Users,'Usuarios','usuarios'],[BookOpen,'Cursos','cursos'],[BarChart3,'Reportes','reportes']].map(([Icon,lbl,t])=><button key={t} onClick={()=>setTab(t)} className={`nav-item ${tab===t?'active':''}`}><span className="nav-icon"><Icon size={16}/></span>{lbl}</button>)}</nav>
        <div className="sidebar-footer"><div className="user-profile-badge"><div className="user-avatar">{usuario?.[0]?.toUpperCase()||'A'}</div><div className="user-info"><p className="user-name">{usuario}</p><p className="sidebar-role">Administrador</p></div></div><button onClick={()=>{logout();navigate("/login");}} className="btn-logout">Cerrar sesión</button></div>
      </aside>
      <div className="main-content">
        <header className="page-header"><h1 className="page-title">{tab==='usuarios'?'Gestión de usuarios':tab==='cursos'?'Gestión de cursos':'Reportes de progreso'}</h1>{tab==='usuarios'&&<button onClick={()=>setModal(true)} className="btn-action-primary">+ Nuevo usuario</button>}</header>
        <div className="page-body">
          {loading?<p className="loading-text">Cargando datos...</p>:(
            <>
              <div className="dashboard-stats">
                <div className="stat-card stat-card-featured"><div className="stat-icon-box stat-icon-blue"><Users size={20} color="var(--primary)"/></div><div><p className="stat-value">{totalAlumnos}</p><p className="stat-label">Alumnos</p><p className="stat-subtext stat-subtext-blue">{pctAlumnos}% del total</p></div></div>
                <div className="stat-card stat-card-featured stat-card-featured-purple"><div className="stat-icon-box stat-icon-purple"><BookOpen size={20} color="var(--purple)"/></div><div><p className="stat-value">{cursosActivos}</p><p className="stat-label">Cursos activos</p><p className="stat-subtext stat-subtext-purple">{pctCursosActivos}% de {totalCursos} cursos</p></div></div>
                <div className="stat-card"><div className="stat-icon-box stat-icon-green"><Presentation size={20} color="var(--success)"/></div><div><p className="stat-value">{totalInstructores}</p><p className="stat-label">Instructores</p><p className="stat-subtext stat-subtext-green">{pctInstructores}% del total</p></div></div>
                <div className="stat-card"><div className="stat-icon-box stat-icon-neutral"><User size={20} color="var(--text-muted)"/></div><div><p className="stat-value">{totalUsuarios}</p><p className="stat-label">Usuarios total</p></div></div>
              </div>
              {tab === 'usuarios' && (
                <div className="panel-block">
                  <div className="panel-block-head">
                    <div>
                      <h2 className="panel-block-title">Usuarios</h2>
                      <p className="panel-block-sub">{totalUsuarios} registros en el sistema</p>
                    </div>
                  </div>
                  <div className="table-card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          {['Nombre', 'Email', 'Rol', 'Estado', 'Acciones'].map((h) => (
                            <TH key={h} c={h} />
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((u) => {
                          const rc = rcCls(u.rol);
                          return (
                            <tr key={u._id}>
                              <TD
                                c={
                                  <div className="cell-user">
                                    <div className="table-avatar">
                                      {u.nombre?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <span className="table-strong">{u.nombre}</span>
                                  </div>
                                }
                              />
                              <TD c={u.email} />
                              <TD c={<span className={`badge ${rc}`}>{u.rol}</span>} />
                              <TD
                                c={
                                  <span
                                    className={`badge ${
                                      u.activo ? 'badge-success' : 'badge-inactive'
                                    }`}
                                  >
                                    {u.activo ? 'Activo' : 'Inactivo'}
                                  </span>
                                }
                              />
                              <TD
                                c={
                                  <div className="cell-actions">
                                    <button
                                      onClick={() => handleToggle(u._id)}
                                      className="icon-btn"
                                    >
                                      {/* Íconos en color negro aquí */}
                                      {u.activo ? (
                                        <Lock size={14} color="black" />
                                      ) : (
                                        <Unlock size={14} color="black" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDelU(u._id)}
                                      className="icon-btn icon-btn-danger"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                }
                              />
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {tab==='cursos'&&<div className="panel-block"><div className="panel-block-head"><div><h2 className="panel-block-title">Cursos</h2><p className="panel-block-sub">{totalCursos} cursos · {cursosActivos} activos</p></div></div><div className="table-card"><table className="data-table"><thead><tr>{['Curso','Módulos','Estado','Acciones'].map(h=><TH key={h} c={h}/>)}</tr></thead><tbody>{cursos.map(c=><tr key={c._id}><TD c={c.titulo} strong/><TD c={c.modulos?.length||0}/><TD c={<span className={`badge ${c.activo?'badge-success':'badge-danger'}`}>{c.activo?'Activo':'Inactivo'}</span>}/><TD c={<div className="cell-actions"><button onClick={()=>handleDelC(c._id)} className="icon-btn icon-btn-danger"><Trash2 size={14}/></button></div>}/></tr>)}</tbody></table></div></div>}
              {tab==='reportes'&&(reporte.length===0?<div className="empty-state"><p className="panel-empty">Sin datos de progreso aún.</p></div>:(
              <div className="panel-block">
                <div className="report-charts-grid">
                  <div className="chart-card chart-card-wide">
                    <div className="chart-head"><h3 className="chart-title">Progreso promedio por curso</h3><p className="chart-sub">% promedio completado por cada curso</p></div>
                    <div className="chart-body chart-body-tall">
                      {progresoPorCurso.length===0?<p className="chart-empty">Sin datos de progreso.</p>:
                      <ResponsiveContainer width="100%" height="100%"><BarChart data={progresoPorCurso} layout="vertical" margin={{left:16,right:40,top:4,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={CHART.subtle} horizontal={false}/><XAxis type="number" domain={[0,100]} tickLine={false} axisLine={false} tick={{fontSize:11,fill:CHART.muted}}/><YAxis type="category" dataKey="curso" width={150} tickLine={false} axisLine={false} tick={{fontSize:11,fill:CHART.body}}/><Tooltip formatter={(v)=>[`${v}%`,'Progreso promedio']} cursor={{fill:CHART.subtle}}/><Bar dataKey="promedio" fill={CHART.primary} radius={[0,6,6,0]} barSize={16} label={{position:'right',fill:CHART.body,fontSize:11,fontWeight:600,formatter:(v)=>`${v}%`}}/></BarChart></ResponsiveContainer>}
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="chart-head"><h3 className="chart-title">Tasa de aprobación</h3><p className="chart-sub">{donutAprob.total===0?'Sin quizzes':`${donutAprob.pct}% de quizzes aprobados`}</p></div>
                    <div className="chart-body">
                      {donutAprob.total===0?<p className="chart-empty">Sin calificaciones todavía.</p>:<>
                      <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'Aprobadas',value:donutAprob.aprob},{name:'No aprobadas',value:donutAprob.noAprob}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={2} strokeWidth={0}><Cell fill={CHART.success}/><Cell fill={CHART.danger}/></Pie><Tooltip/></PieChart></ResponsiveContainer>
                      <div className="chart-legend"><span className="legend-item"><span className="legend-dot legend-dot-success"/>Aprobadas ({donutAprob.aprob})</span><span className="legend-item"><span className="legend-dot legend-dot-danger"/>No aprobadas ({donutAprob.noAprob})</span></div>
                      </>}
                    </div>
                  </div>
                  <div className="chart-card">
                    <div className="chart-head"><h3 className="chart-title">Promedio por quiz</h3><p className="chart-sub">Los {califPorQuiz.length} quizzes con mejor calificación</p></div>
                    <div className="chart-body">
                      {califPorQuiz.length===0?<p className="chart-empty">Sin calificaciones todavía.</p>:
                      <ResponsiveContainer width="100%" height="100%"><BarChart data={califPorQuiz} margin={{top:4,right:8,left:-14,bottom:4}}><CartesianGrid strokeDasharray="3 3" stroke={CHART.subtle} vertical={false}/><XAxis dataKey="quiz" interval={0} tickLine={false} axisLine={false} tickFormatter={(v)=>v.length>16?v.slice(0,15)+'…':v} tick={{fontSize:10,fill:CHART.muted}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:CHART.muted}}/><Tooltip cursor={{fill:CHART.subtle}}/><Bar dataKey="promedio" fill={CHART.purple} radius={[6,6,0,0]} maxBarSize={28} label={{position:'top',fill:CHART.body,fontSize:10.5,fontWeight:600}}/></BarChart></ResponsiveContainer>}
                    </div>
                  </div>
                </div>
                <div className="panel-block-head panel-block-head-top"><div><h2 className="panel-block-title">Detalle por alumno</h2><p className="panel-block-sub">{reporte.length} alumnos con progreso y calificaciones</p></div></div>
                <div className="table-card"><table className="data-table"><thead><tr>{['Alumno','Email','Cursos','Quizzes','Aprobados'].map(h=><TH key={h} c={h}/>)}</tr></thead><tbody>{reporte.map(r=><tr key={r.alumno.id}><TD c={r.alumno.nombre} strong/><TD c={r.alumno.email}/><TD c={r.progresos.length}/><TD c={r.calificaciones.length}/><TD c={<span className={`badge ${r.calificaciones.filter(c=>c.aprobado).length>0?'badge-success':'badge-neutral'}`}>{r.calificaciones.filter(c=>c.aprobado).length}/{r.calificaciones.length}</span>}/></tr>)}</tbody></table></div>
              </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}