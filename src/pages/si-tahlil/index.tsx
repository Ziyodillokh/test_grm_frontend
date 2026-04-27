import { useEffect, useRef, useState } from "react";
import { Send, Mic } from "lucide-react";

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

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const time = new Date().toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed, time },
    ]);
    setText("");
    setSending(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          text: "This interface is designed to display the response text that the artificial intelligence sends to the user.",
          time: new Date().toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
    <div className="h-full grid grid-cols-11 gap-x-[20px]">
      {/* Umumiy chat container — overflow-hidden, subtitle/line dan input row gacha */}
      <div className="col-span-5 relative h-full flex flex-col overflow-hidden">
        {/* Subtitle 15px regular — chat ustuni eni bo'yicha */}
        <p className="shrink-0 text-[15px] font-normal text-[#1a1a1a]">
          Sun'iy intellekt tahlili
        </p>
        {/* 10px pastida fixed line — chat ustuni eni bo'yicha */}
        <div className="shrink-0 mt-[10px] h-[1px] bg-[#1a1a1a]/10" />

        {/* Scroll area — flex-1, scroll qilganda overflow-hidden ichida qoladi */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto scrollCastom pt-[24px] pb-[110px] flex flex-col gap-[16px]"
        >
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col gap-[6px] max-w-[80%] ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  {/* Bubble */}
                  <div className="bg-white rounded-[12px] px-[20px] py-[14px] shadow-[0px_2px_8px_0px_rgba(12,36,58,0.04)]">
                    <p className="text-[15px] leading-[22px] text-[#1a1a1a] whitespace-pre-wrap break-words">
                      {m.text}
                    </p>
                  </div>
                  {/* Vaqt */}
                  <span className="text-[12px] text-[#A3A3A3] px-[4px]">{m.time}</span>
                </div>
              );
            })}

            {sending && (
              <div className="self-start max-w-[80%]">
                <div className="bg-white rounded-[12px] px-[20px] py-[14px] shadow-[0px_2px_8px_0px_rgba(12,36,58,0.04)]">
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

        {/* Input row — col-span-5 ichida fixed, ekran pastidan 40px.
            Page bg-color va pt mask sifatida — scroll qilganda inputni pastiga tushgan textlar bekitiladi */}
        <div className="absolute left-0 right-0 bottom-0 pb-[40px] pt-[16px] bg-[#f5f7f9] flex items-center gap-[12px]">
            {/* Input + Send — 50px, default borderless, focus-within border */}
            <div className="flex-1 flex items-center gap-[8px] bg-white rounded-[12px] border border-transparent focus-within:border-[#e7ebf0] h-[50px] px-[20px] shadow-[0px_2px_8px_0px_rgba(12,36,58,0.04)] transition-colors">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Write here what you want to ask..."
                className="flex-1 h-full bg-transparent outline-none text-[15px] text-[#1a1a1a] placeholder:text-[#A3A3A3]"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim() || sending}
                className="w-[32px] h-[32px] flex items-center justify-center disabled:opacity-30 transition shrink-0"
                aria-label="Yuborish"
              >
                <Send className="w-[18px] h-[18px] text-[#1a1a1a]" />
              </button>
            </div>

            {/* Mic — alohida tugma 50×50 */}
            <button
              type="button"
              className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center shrink-0 hover:bg-[#f5f7f9] transition shadow-[0px_2px_8px_0px_rgba(12,36,58,0.04)]"
              aria-label="Ovoz yuborish"
            >
            <Mic className="w-[20px] h-[20px] text-[#1a1a1a]" />
          </button>
        </div>
      </div>
    </div>
  );
}
