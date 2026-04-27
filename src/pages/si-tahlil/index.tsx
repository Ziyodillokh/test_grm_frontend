import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

export default function SiTahlilPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Yangi xabar kelganda pastga skroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const now = new Date();
    const time = now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed, time },
    ]);
    setText("");
    setSending(true);

    // Backend AI integratsiyasi yo'q — placeholder javob 800ms dan keyin
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          text: "Sun'iy intellekt javobi tayyorlanmoqda. Bu hozircha placeholder javob.",
          time: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setSending(false);
    }, 800);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Sarlavha */}
      <div className="shrink-0">
        <h1 className="text-[20px] font-medium text-[#1a1a1a]">Sun'iy intellekt tahlili</h1>
        {/* 10px pastida fixed line */}
        <div className="mt-[10px] h-[1px] bg-[#1a1a1a]/10" />
      </div>

      {/* Chat scroll area — line ichiga skrolllanadi */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto scrollCastom pt-[20px] pb-[140px]"
      >
        <div className="grid grid-cols-5 gap-x-[16px] gap-y-[12px]">
          {messages.length === 0 && !sending && (
            <div className="col-span-5 flex items-center justify-center py-[60px]">
              <span className="text-[14px] text-[#A3A3A3]">
                Sun'iy intellektga savolingizni yozing
              </span>
            </div>
          )}

          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={
                  isUser
                    ? "col-start-2 col-end-6 flex justify-end"
                    : "col-start-1 col-end-5 flex justify-start"
                }
              >
                <div
                  className={`max-w-full rounded-[12px] px-[16px] py-[12px] text-[14px] leading-[1.5] ${
                    isUser
                      ? "bg-[#0078d4] text-white"
                      : "bg-white text-[#1a1a1a] border border-[#e7ebf0]"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <p
                    className={`mt-[6px] text-[11px] ${
                      isUser ? "text-white/70" : "text-[#999]"
                    }`}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="col-start-1 col-end-5 flex justify-start">
              <div className="rounded-[12px] px-[16px] py-[12px] bg-white border border-[#e7ebf0]">
                <div className="flex items-center gap-[6px]">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#A3A3A3] animate-pulse" />
                  <span
                    className="w-[6px] h-[6px] rounded-full bg-[#A3A3A3] animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-[6px] h-[6px] rounded-full bg-[#A3A3A3] animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input — pastdan 40px, balandlik 54px, fixed */}
      <div className="absolute left-0 right-0 bottom-[40px] flex items-center gap-[8px] bg-white rounded-[8px] border border-[#e7ebf0] h-[54px] px-[16px] shadow-sm">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Savolingizni yozing..."
          className="flex-1 h-full bg-transparent outline-none text-[14px] text-[#1a1a1a] placeholder:text-[#A3A3A3]"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="w-[36px] h-[36px] rounded-[8px] bg-[#0078d4] hover:bg-[#0066b8] flex items-center justify-center disabled:opacity-40 transition"
          aria-label="Yuborish"
        >
          <Send className="w-[16px] h-[16px] text-white" />
        </button>
      </div>
    </div>
  );
}
