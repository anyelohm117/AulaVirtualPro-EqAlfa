const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `
Eres "AulaBot", el asistente virtual de AulaVirtualPro, la plataforma de capacitación empresarial de CapacitaTec S.A.
Tu función es ayudar a los usuarios con dudas sobre la plataforma: cómo inscribirse a un curso, cómo ver su progreso,
cómo realizar quizzes, cómo consultar sus calificaciones, qué es un curso/módulo/lección, entre otros temas del sistema.
Responde siempre en español, de forma clara, breve y amigable. Si el usuario proporciona contexto de una lección,
responde dudas sobre ese contenido específico. Si no sabes algo sobre la plataforma, indícalo con honestidad.
`;

/**
 * @desc    Envía un mensaje al asistente con IA (Groq) y devuelve su respuesta
 * @route   POST /api/v1/asistente/chat
 * @access  Private (cualquier usuario autenticado)
 */
const chat = async (req, res) => {
  try {
    const { mensaje, contexto } = req.body;

    if (!mensaje || !mensaje.trim()) {
      return res.status(400).json({ error: 'El campo mensaje es requerido' });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (contexto && contexto.trim()) {
      messages.push({
        role: 'system',
        content: `Contexto de la lección actual del alumno: ${contexto.trim()}`,
      });
    }

    messages.push({ role: 'user', content: mensaje });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const respuesta = completion.choices?.[0]?.message?.content?.trim() || 'Sin respuesta';

    return res.status(200).json({ respuesta });
  } catch (error) {
    console.error('Error en asistente:', error.message);
    return res.status(500).json({ error: 'Error al generar respuesta', detalle: error.message });
  }
};

module.exports = { chat };