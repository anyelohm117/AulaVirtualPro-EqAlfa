import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [contexto, setContexto] = useState("");

  return (
    <ChatContext.Provider value={{ contexto, setContexto }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}