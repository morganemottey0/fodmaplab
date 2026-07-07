"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/fodmap";

const SUGGESTIONS = [
  "Puis-je manger de l'avocat ?",
  "Substituts à l'ail ?",
  "Lait végétal low-FODMAP ?",
  "Idée petit-déjeuner rapide",
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
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: "Une erreur est survenue." }]);
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
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: "Impossible de contacter le serveur." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>

      {/* Header */}
      <div className="gradient-primary flex-shrink-0" style={{ padding: "52px 24px 20px" }}>
        <div className="decoration-circle-lg" />
        <div className="decoration-circle-sm" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold m-0">Diététicien AI</p>
            <p className="text-xs m-0" style={{ color: "rgba(255,255,255,0.6)" }}>Expert FODMAP · en ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-app">
        {messages.length === 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm text-muted my-2">
              Bonjour ! Comment puis-je vous aider ?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="card text-left text-xs text-primary cursor-pointer"
                  style={{ lineHeight: 1.5 }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-surface text-primary border border-primary"
              }`}
              style={{
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                lineHeight: 1.6,
              }}
            >
              {msg.content || <span className="text-muted">En train de répondre...</span>}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-surface flex-shrink-0 px-4 py-3" style={{ borderTop: "1px solid var(--primary-border)", paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}>
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Votre question..."
            rows={1}
            className="input flex-1 resize-none"
            style={{ padding: "10px 14px" }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50"
          >
            <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "7px solid #fff", marginLeft: "2px" }} />
          </button>
        </div>
        <p className="text-xs text-center text-muted mt-2">
          Ne remplace pas l'avis d'un professionnel de santé
        </p>
      </div>

    </div>
  );
}