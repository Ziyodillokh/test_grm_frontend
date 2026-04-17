import FormTextInput from "@/components/forms/FormTextInput";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Loader2, Sun, User, Key, Mic, Maximize2, Eye } from "lucide-react";

// Ob-havo icon (quyosh)
function WeatherIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="6" stroke="#272727" strokeWidth="1.5" />
      <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.8 7.8l2.1 2.1M22.1 22.1l2.1 2.1M7.8 24.2l2.1-2.1M22.1 9.9l2.1-2.1" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Yangi xabarlar mock data
const notifications = [
  {
    id: 1,
    icon: "📋",
    color: "bg-purple-500",
    title: "HISOBOT SO'RASHDI",
    desc: "7 turdagi hisobot shaklini so'rashdi",
  },
  {
    id: 2,
    icon: "🔄",
    color: "bg-green-500",
    title: "TRANSFER",
    desc: "28 Transfer ko'rilmagan",
  },
  {
    id: 3,
    icon: "📦",
    color: "bg-gray-700",
    title: "Partiya",
    desc: "8 - partiya Turkiya Sanat Hali",
  },
];

export default function LoginFormContent({
  isPending,
}: {
  isPending: boolean;
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f5f5f5] overflow-hidden">
      {/* Header — 90px, 16-column grid */}
      <header
        className="h-[90px] shrink-0 bg-white border-b border-[#e8e8e8]"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          columnGap: "20px",
          padding: "0 20px",
          alignItems: "center",
        }}
      >
        <div
          style={{ gridColumn: "2 / 5" }}
          className="flex items-center gap-2"
        >
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
          </div>
          <span className="text-[15px] font-medium text-[#272727] ml-2">
            OneIP System
          </span>
        </div>
        <div
          style={{ gridColumn: "14 / 17" }}
          className="flex items-center justify-end gap-2 text-[15px] text-[#272727]"
        >
          <Sun className="w-5 h-5" />
          Ui Mavzusi
        </div>
      </header>

      {/* Main content — 16 column grid */}
      <div
        className="flex-1 overflow-auto"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          columnGap: "20px",
          padding: "0 20px",
          alignContent: "start",
        }}
      >
        {/* Logo — col 3, 50px pastda */}
        <div style={{ gridColumn: "3 / 7" }} className="pt-[50px]">
          <img src="/logo.svg" className="h-[40px]" alt="OneIP" />
        </div>

        {/* Section labels — bitta qator, har biri o'z columnida */}
        <span
          style={{ gridColumn: "3 / 6" }}
          className="mt-[50px] text-[15px] text-[#8a8a8a]"
        >
          Bugun
        </span>
        <span
          style={{ gridColumn: "6 / 10" }}
          className="mt-[50px] text-[15px] text-[#8a8a8a]"
        >
          Ko'rsatkichlar
        </span>
        <span
          style={{ gridColumn: "10 / 17" }}
          className="mt-[50px] text-[15px] text-[#8a8a8a] text-right"
        >
          Murojaatlar, talablar va takliflar +4
        </span>

        {/* ═══ CHAP TOMON — cols 3-9 ═══ */}
        <div
          style={{ gridColumn: "3 / 10" }}
          className="mt-[16px] flex flex-col"
        >
          {/* Soat + Ko'rsatkichlar (ob-havo, server) */}
          <div className="flex items-end gap-[40px]">
            {/* Soat + sana */}
            <div>
              <p className="text-[72px] font-light text-[#272727] leading-none tracking-tight">
                {timeStr}
              </p>
              <p className="text-[15px] text-[#8a8a8a] mt-[4px]">{dateStr}</p>
            </div>
            {/* Ob-havo + Server */}
            <div className="flex flex-col gap-[16px] pb-[6px]">
              <div className="flex items-center gap-[12px]">
                <WeatherIcon />
                <div>
                  <p className="text-[17px] font-semibold text-[#272727]">
                    +4 °C
                  </p>
                  <p className="text-[13px] text-[#8a8a8a]">Quyoshli kun</p>
                </div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="relative w-[32px] h-[32px] flex items-center justify-center">
                  <span className="text-[18px] font-bold text-[#272727]">
                    28
                  </span>
                  <span className="text-[10px] text-[#272727] absolute top-0 right-0">
                    %
                  </span>
                </div>
                <div>
                  <p className="text-[17px] font-semibold text-[#272727]">
                    Server indikatori
                  </p>
                  <p className="text-[13px] text-[#8a8a8a]">Yuklama</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kirish bo'limi — soatdan 40px pastda */}
          <div className="mt-[40px] flex items-center gap-[16px]">
            <div className="w-[60px] h-[60px] rounded-full bg-[#4A9FE5] flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-[17px] font-semibold text-[#272727]">Kirish</p>
              <p className="text-[13px] text-[#8a8a8a]">
                Foydalanuvchi mavjud emas
              </p>
            </div>
          </div>

          {/* PIN input — avatardan 24px pastda */}
          <div className="mt-[24px]">
            <div className="relative">
              <Key className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8a8a8a]" />
              <FormTextInput
                name="login"
                type="password"
                placeholder="PIN-ko'dni kiriting"
                classNameInput="h-[44px] pl-[44px] pr-[16px] text-[15px] bg-white border border-[#e0e0e0] rounded-lg"
                className="mb-0"
                handleKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const form = e.currentTarget.closest("form");
                    if (form) form.requestSubmit();
                  }
                }}
              />
            </div>
            <p className="text-[13px] text-[#b0b0b0] mt-[8px]">
              Kitirgandan so'ng Enter tugmasini bosing
            </p>
            <button type="submit" className="hidden">
              {isPending && <Loader2 className="animate-spin" />}
            </button>
          </div>
        </div>

        {/* ═══ O'NG TOMON — cols 10-14 (5 column) ═══ */}
        <div
          style={{ gridColumn: "10 / 15" }}
          className="mt-[16px] flex flex-col pb-[20px]"
        >
          {/* Carousel — 570px */}
          <div className="h-[570px] rounded-2xl overflow-hidden relative bg-[#1a1a1a]">
            <Carousel
              plugins={[plugin.current]}
              className="w-full h-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="h-[570px]">
                {[1, 2, 3, 4].map((n) => (
                  <CarouselItem key={n} className="h-[570px]">
                    <img
                      src={`/login/${n}.png`}
                      className="w-full h-full object-cover"
                      alt={`Slide ${n}`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <button className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60">
                <Mic className="w-4 h-4" />
              </button>
              <button className="absolute right-[12px] top-[12px] w-[36px] h-[36px] rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60">
                <Maximize2 className="w-4 h-4" />
              </button>
              <div className="absolute right-[12px] bottom-[12px] flex gap-[8px]">
                <CarouselPrevious className="static translate-x-0 translate-y-0 w-[36px] h-[36px] rounded-full bg-black/40 border-0 text-white hover:bg-black/60" />
                <CarouselNext className="static translate-x-0 translate-y-0 w-[36px] h-[36px] rounded-full bg-black/40 border-0 text-white hover:bg-black/60" />
              </div>
            </Carousel>
          </div>

          {/* Yangi Xabarlar — carousel dan 24px pastda */}
          <div className="mt-[24px] bg-white rounded-2xl p-[24px] flex-1">
            <div className="flex items-center gap-2 mb-[16px]">
              <span className="text-[16px]">🔔</span>
              <span className="text-[15px] font-semibold text-[#272727]">
                Yangi Xabarlar
              </span>
            </div>

            <div className="flex flex-col gap-[8px]">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-[16px] py-[10px]"
                >
                  <div
                    className={`w-[48px] h-[48px] rounded-full ${item.color} flex items-center justify-center text-white text-[18px] shrink-0`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#272727]">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-[#8a8a8a] truncate">
                      {item.desc}
                    </p>
                  </div>
                  <button className="w-[36px] h-[36px] rounded-full bg-[#E8F4FD] flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 text-[#4A9FE5]" />
                  </button>
                </div>
              ))}
            </div>

            <button className="text-[14px] text-[#4A9FE5] font-medium mt-[12px]">
              Barcha xabarlar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
