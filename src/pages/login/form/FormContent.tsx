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
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
  ];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f5f7f9] overflow-hidden">
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
          style={{ gridColumn: "12 / 15" }}
          className="flex items-center justify-end gap-2 text-[15px] text-[#272727]"
        >
          <Sun className="w-5 h-5" />
          Ui Mavzusi
        </div>
      </header>

      {/* Main content — 16 column grid, no page scroll */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          gridTemplateRows: "auto auto auto 1fr",
          columnGap: "20px",
          padding: "0 20px",
        }}
      >
        {/* Logo — col 3, 50px pastda */}
        <div style={{ gridColumn: "3 / 7" }} className="pt-[50px]">
          <img src="/logo.svg" className="h-[40px]" alt="OneIP" />
        </div>

        {/* Section labels — bitta qator, har biri o'z columnida */}
        <span
          style={{ gridColumn: "3 / 5" }}
          className="mt-[50px] mb-[20px] text-[15px] text-[#8a8a8a]"
        >
          Bugun
        </span>
        <span
          style={{ gridColumn: "5 / 10" }}
          className="mt-[50px] mb-[20px] pl-[10px] text-[15px] text-[#8a8a8a]"
        >
          Ko'rsatkichlar
        </span>
        <span
          style={{ gridColumn: "10 / 15" }}
          className="mt-[50px] mb-[20px] text-[15px] text-[#8a8a8a]"
        >
          Murojaatlar, talablar va takliflar +4
        </span>

        {/* ═══ CHAP TOMON — cols 3-9 ═══ */}
        <div
          style={{ gridColumn: "3 / 10" }}
          className="flex flex-col"
        >
          {/* Soat + Ko'rsatkichlar — nested 7-col grid (parent cols 3-9 ga mos) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              columnGap: "20px",
            }}
          >
            {/* Soat + sana — nested cols 1-2 → parent cols 3-4 */}
            <div style={{ gridColumn: "1 / 3" }}>
              <p className="text-[72px] font-light text-[#272727] leading-none tracking-tight">
                {timeStr}
              </p>
              <p className="text-[15px] text-[#8a8a8a] mt-[8px]">{dateStr}</p>
            </div>

            {/* Ko'rsatkichlar — nested cols 3-7 → parent cols 5-9 */}
            <div
              style={{ gridColumn: "3 / 8" }}
              className="flex items-start gap-[30px] pl-[10px]"
            >
              {/* Ob-havo */}
              <div className="flex items-center gap-[12px]">
                <div className="w-[60px] h-[60px] bg-white rounded-sm flex items-center justify-center shrink-0">
                  <WeatherIcon />
                </div>
                <div>
                  <p className="text-[17px] font-semibold text-[#272727]">
                    +4 °C
                  </p>
                  <p className="text-[13px] text-[#8a8a8a]">Quyoshli kun</p>
                </div>
              </div>
              {/* Server indikatori */}
              <div className="flex items-center gap-[12px]">
                <div className="w-[60px] h-[60px] bg-white rounded-sm flex items-center justify-center shrink-0">
                  <div className="relative">
                    <span className="text-[22px] font-bold text-[#272727]">
                      28
                    </span>
                    <span className="text-[10px] text-[#272727] absolute -top-2 -right-3">
                      %
                    </span>
                  </div>
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

        </div>

        {/* ═══ KIRISH — cols 3-5, alohida grid item ═══ */}
        <div
          style={{ gridColumn: "3 / 6" }}
          className="mt-[40px] flex flex-col"
        >
          {/* Avatar */}
          <div className="flex items-center gap-[16px]">
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

          {/* PIN input */}
          <div className="mt-[24px]">
            <div className="relative">
              <Key className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8a8a8a]" />
              <FormTextInput
                name="login"
                type="password"
                placeholder="PIN-ko'dni kiriting"
                classNameInput="h-[44px] pl-[44px] pr-[16px] text-[15px] bg-white border border-[#e0e0e0] rounded-sm"
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

        {/* ═══ O'NG TOMON — cols 10-14, rows 3-4 span ═══ */}
        <div
          style={{ gridColumn: "10 / 15", gridRow: "3 / 5" }}
          className="flex flex-col min-h-0 pb-[20px]"
        >
          {/* Carousel — 4:3 aspect ratio */}
          <div
            className="w-full shrink-0 rounded-sm overflow-hidden relative bg-[#1a1a1a]"
            style={{ aspectRatio: "5 / 3" }}
          >
            <Carousel
              plugins={[plugin.current]}
              className="w-full h-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="h-full">
                {[1, 2, 3, 4].map((n) => (
                  <CarouselItem key={n} className="h-full">
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

          {/* Yangi Xabarlar — qolgan joy, ichki scroll */}
          <div className="mt-[16px] flex-1 min-h-0 bg-white rounded-sm p-[32px] flex flex-col">
            <div className="flex items-center gap-2 mb-[16px] shrink-0 pl-[16px]">
              <span className="text-[16px]">🔔</span>
              <span className="text-[15px] font-normal text-[#272727]">
                Yangi Xabarlar
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
              <div className="flex flex-col gap-[8px]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-[16px] py-[4px]"
                  >
                    <div
                      className={`w-[60px] h-[60px] p-[8px] rounded-full ${item.color} flex items-center justify-center text-white text-[18px] shrink-0`}
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
                    <button className="w-[40px] h-[40px] rounded-sm bg-[#E8F4FD] flex items-center justify-center shrink-0">
                      <Eye className="w-4 h-4 text-[#4A9FE5]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="text-[14px] text-[#4A9FE5] font-medium mt-0 ml-[68px] shrink-0 text-left">
              Barcha xabarlar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
