import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { useChat } from "../context/ChatContext";
import api from "../services/api";
import "../styles/chat.css";

export default function ChatWidget() {
  const { contexto } = useChat();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes, escribiendo, abierto]);

  const enviar = async (e) => {
    e.preventDefault();
    const texto = input.trim();
    if (!texto || escribiendo) return;
    setInput("");
    setMensajes((m) => [...m, { rol: "user", contenido: texto }]);
    setEscribiendo(true);
    try {
      const r = await api.post("/asistente/chat", {
        mensaje: texto,
        contexto: contexto || "",
      });
      setMensajes((m) => [...m, { rol: "assistant", contenido: r.data.respuesta }]);
    } catch {
      setMensajes((m) => [
        ...m,
        { rol: "assistant", contenido: "Ocurrió un error al contactar al asistente. Intenta de nuevo." },
      ]);
    } finally {
      setEscribiendo(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setAbierto((a) => !a)}
        className={`chat-fab ${abierto ? "chat-fab-active" : ""}`}
        aria-label={abierto ? "Cerrar chat" : "Abrir chat"}
      >
        {abierto ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      {abierto && (
        <div className="chat-panel">
          <div className="chat-panel-head">
            <div className="chat-panel-avatar">
              <Bot size={18} color="#fff" />
            </div>
            <div>
              <p className="chat-panel-title">AulaBot</p>
              <p className="chat-panel-sub">Asistente de AulaVirtualPro</p>
            </div>
          </div>
          <div className="chat-messages" ref={scrollRef}>
            {mensajes.length === 0 && (
              <div className="chat-welcome">
                <p className="chat-welcome-text">
                  ¡Hola! Soy AulaBot, tu asistente de la plataforma. Pregúntame sobre cómo
                  inscribirte a cursos, ver tu progreso, realizar quizzes o cualquier duda del sistema.
                </p>
              </div>
            )}
            {mensajes.map((m, i) => (
              <div key={i} className={`chat-msg ${m.rol === "user" ? "chat-msg-user" : "chat-msg-bot"}`}>
                {m.contenido}
              </div>
            ))}
            {escribiendo && (
              <div className="chat-msg chat-msg-bot chat-msg-typing">
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
                <span className="chat-typing-dot" />
              </div>
            )}
          </div>
          <form onSubmit={enviar} className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Escribe tu duda..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={escribiendo}
            />
            <button type="submit" className="chat-send-btn" disabled={escribiendo || !input.trim()} aria-label="Enviar">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}