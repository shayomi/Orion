"use client";

import { useState, useRef, useEffect } from "react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Plus } from "lucide-react";
import { mockChatHistory, mockOrganization } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const chips = ["Explain vesting", "Generate NDA", "Check my risks", "What's next?"];

function formatMessage(content: string) {
  return content
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function AIPage() {
  const [messages, setMessages] = useState(mockChatHistory);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    const assistantMsg = {
      id: `msg_${Date.now() + 1}`,
      role: "assistant",
      content:
        "This is a placeholder response from Orion. Once connected to the AI backend, I'll provide context-aware legal guidance based on your startup profile and current stage.",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar title="AI Assistant" subtitle="Orion Legal Co-pilot" />

      {/* Context bar */}
      <div className="px-6 py-2.5 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-xs text-indigo-700 font-medium">
          Context: {mockOrganization.name} · {mockOrganization.structure} · {mockOrganization.stage}
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
              <div
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
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
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white">
        {/* Chips */}
        <div className="flex gap-2 mb-3">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="px-3 py-1 rounded-full text-xs border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-indigo-300 focus-within:bg-white transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Orion anything about your legal setup..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
          <Button onClick={handleSend} disabled={!input.trim()} size="md">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Orion provides guidance, not legal advice. Consult a licensed attorney for binding decisions.
        </p>
      </div>
    </div>
  );
}
