"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const chips = [
  "What legal issues should I fix first?",
  "Explain vesting schedules",
  "Do I need an NDA?",
  "Am I ready for fundraising?",
];

function formatMessage(content: string) {
  return content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Orion, your legal co-pilot. I have context on your startup profile and any legal issues we've flagged. Ask me anything about your legal setup — I'm here to help you understand the issues and take the right next steps.\n\n**This is general guidance, not legal advice.** For binding decisions, consult a licensed attorney.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text?: string) => {
      const messageText = text || input.trim();
      if (!messageText || isStreaming) return;

      const userMsg: Message = {
        id: `msg_${Date.now()}`,
        role: "user",
        content: messageText,
        timestamp: new Date().toISOString(),
      };

      const assistantId = `msg_${Date.now() + 1}`;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to get response");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: m.content + parsed.content }
                        : m
                    )
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      } catch (error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm having trouble connecting right now. Please try again in a moment.",
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    },
    [input, isStreaming]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Context bar */}
      <div className="px-6 py-2.5 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-xs text-indigo-700 font-medium">
          AI co-pilot · Context-aware · Connected to your startup profile
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm"
              )}
            >
              {msg.content ? (
                <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              )}
              {msg.content && (
                <p
                  className={cn(
                    "text-[10px] mt-1.5",
                    msg.role === "user" ? "text-indigo-200" : "text-gray-400"
                  )}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2 mb-3">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              disabled={isStreaming}
              className="px-3 py-1 rounded-full text-xs border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-indigo-300 focus-within:bg-white transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Orion anything about your legal setup..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              disabled={isStreaming}
            />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            size="md"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Orion provides guidance, not legal advice. Consult a licensed attorney for binding decisions.
        </p>
      </div>
    </div>
  );
}
