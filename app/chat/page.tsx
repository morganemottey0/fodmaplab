"use client";

import { tapProps } from "@/lib/tap";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/fodmap";

const SUGGESTIONS = [
  "Puis-je manger de l'avocat ?",
  "Substituts à l'ail ?",
  "Idée de petit-déjeuner rapide",
  "Quels laits végétaux ?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: "Une erreur est survenue." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Impossible de contacter le serveur." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>

      {/* Header */}
      <div style={{ background: "#185FA5", padding: "52px 24px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "#0C447C",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#85B7EB" }} />
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#fff", margin: 0 }}>Diététicien AI</p>
            <p style={{ fontSize: "11px", color: "#85B7EB", margin: 0 }}>Expert FODMAP · en ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "13px", color: "#85B7EB", textAlign: "center", margin: "8px 0 16px" }}>
              Bonjour ! Comment puis-je vous aider ?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  {...tapProps(() => send(s))}
                  style={{
                    background: "#fff",
                    border: "1px solid #DAEAF8",
                    borderRadius: "14px",
                    padding: "12px",
                    fontSize: "12px",
                    color: "#0C447C",
                    textAlign: "left",
                    cursor: "pointer",
                    lineHeight: 1.4,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              padding: "12px 14px",
              background: msg.role === "user" ? "#185FA5" : "#fff",
              border: msg.role === "user" ? "none" : "1px solid #DAEAF8",
              fontSize: "13px",
              color: msg.role === "user" ? "#fff" : "#0C447C",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}>
              {msg.content || (
                <span style={{ color: "#85B7EB" }}>En train de répondre...</span>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        background: "#fff",
        borderTop: "1px solid #DAEAF8",
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Posez votre question..."
            rows={1}
            style={{
              flex: 1,
              background: "#F8FBFF",
              border: "1px solid #DAEAF8",
              borderRadius: "14px",
              padding: "12px 14px",
              fontSize: "14px",
              color: "#0C447C",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            {...tapProps(() => send())}
            disabled={loading || !input.trim()}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "none",
              background: loading || !input.trim() ? "#B5D4F4" : "#185FA5",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid #fff", marginLeft: "2px" }} />
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#B5D4F4", textAlign: "center", margin: "8px 0 0" }}>
          Ne remplace pas l'avis d'un professionnel de santé
        </p>
      </div>

    </div>
  );
}