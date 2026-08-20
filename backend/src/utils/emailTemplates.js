/**
 * Plantilla de bienvenida al registrarse
 */
const bienvenidaTemplate = (nombre) => ({
  subject: '¡Bienvenido a AulaVirtual Pro! 🎓',
  html: `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f0f4f8; padding: 24px;">
      <div style="background: #1a3a5c; border-radius: 12px 12px 0 0; padding: 28px 32px; text-align: center;">
        <h1 style="color: #fff; font-size: 22px; margin: 0;">🎓 AulaVirtual Pro</h1>
        <p style="color: #85B7EB; font-size: 13px; margin: 6px 0 0;">LMS para Capacitación Empresarial</p>
      </div>
      <div style="background: #fff; border-radius: 0 0 12px 12px; padding: 32px;">
        <h2 style="color: #111827; font-size: 18px; margin: 0 0 12px;">¡Hola, ${nombre}! 👋</h2>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Tu cuenta ha sido creada exitosamente. Ya puedes acceder a la plataforma 
          y explorar todos los cursos disponibles.
        </p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 0 0 20px; border-left: 3px solid #185FA5;">
          <p style="color: #374151; font-size: 13px; margin: 0 0 6px;"><strong>¿Qué puedes hacer?</strong></p>
          <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.6;">
            ✓ Explorar el catálogo de cursos<br/>
            ✓ Inscribirte en los cursos de tu interés<br/>
            ✓ Seguir tu progreso por lección<br/>
            ✓ Realizar evaluaciones y obtener calificaciones
          </p>
        </div>
        <a href="http://localhost:5173/login" 
           style="display: inline-block; background: #185FA5; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
          Iniciar sesión →
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">
          CapacitaTec S.A. · AulaVirtual Pro
        </p>
      </div>
    </div>
  `,
});

/**
 * Plantilla de confirmación de inscripción a un curso
 */
const inscripcionTemplate = (nombre, tituloCurso) => ({
  subject: `¡Inscripción exitosa! Ahora eres parte de "${tituloCurso}" 🚀`,
  html: `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f0f4f8; padding: 24px;">
      <div style="background: #1a3a5c; border-radius: 12px 12px 0 0; padding: 28px 32px; text-align: center;">
        <h1 style="color: #fff; font-size: 22px; margin: 0;">🎓 AulaVirtual Pro</h1>
        <p style="color: #85B7EB; font-size: 13px; margin: 6px 0 0;">LMS para Capacitación Empresarial</p>
      </div>
      <div style="background: #fff; border-radius: 0 0 12px 12px; padding: 32px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 48px;">✅</span>
        </div>
        <h2 style="color: #111827; font-size: 18px; margin: 0 0 12px; text-align: center;">
          ¡Inscripción exitosa!
        </h2>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Hola <strong>${nombre}</strong>, ya formas parte del curso:
        </p>
        <div style="background: #E6F1FB; border-radius: 8px; padding: 16px; margin: 0 0 20px; text-align: center;">
          <p style="color: #185FA5; font-size: 16px; font-weight: 600; margin: 0;">📚 ${tituloCurso}</p>
        </div>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          Puedes empezar a aprender desde ahora. Tu progreso se guardará automáticamente 
          y podrás retomarlo cuando quieras.
        </p>
        <a href="http://localhost:5173/catalog" 
           style="display: inline-block; background: #185FA5; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
          Ir a mis cursos →
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">
          CapacitaTec S.A. · AulaVirtual Pro
        </p>
      </div>
    </div>
  `,
});

module.exports = { bienvenidaTemplate, inscripcionTemplate };