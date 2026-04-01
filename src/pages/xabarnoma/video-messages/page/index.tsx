import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Activity,
  RefreshCw,
  Play,
  MoreVertical,
  Video,
  Mic,
  TrendingUp,
  DollarSign,
  Cloud,
} from "lucide-react";
import UploadModal from "../components/upload-modal";

interface VideoEntry {
  id: number;
  userName: string;
  role: string;
  date: string;
  thumbnailColor: string;
}

const mockVideos: VideoEntry[] = [
  {
    id: 1,
    userName: "Abbos Janizakov",
    role: "F-manager",
    date: "12 Mart 2026 10:00",
    thumbnailColor: "#E8E8E8",
  },
  {
    id: 2,
    userName: "Abbos Janizakov",
    role: "F-manager",
    date: "12 Mart 2026 10:00",
    thumbnailColor: "#E0E0E0",
  },
  {
    id: 3,
    userName: "Abbos Janizakov",
    role: "F-manager",
    date: "12 Mart 2026 10:00",
    thumbnailColor: "#D8D8D8",
  },
  {
    id: 4,
    userName: "Abbos Janizakov",
    role: "F-manager",
    date: "12 Mart 2026 10:00",
    thumbnailColor: "#D0D0D0",
  },
  {
    id: 5,
    userName: "Abbos Janizakov",
    role: "F-manager",
    date: "12 Mart 2026 10:00",
    thumbnailColor: "#C8C8C8",
  },
];

export default function VideoMessagesPage() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry>(mockVideos[0]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate("/xabarnoma")}
          className="text-[#999] hover:text-[#1A1A1A] transition-colors"
        >
          Xabarnoma
        </button>
        <span className="text-[#999]">&bull;</span>
        <span className="text-[#1A1A1A] font-medium">Video murojaatlar</span>
      </div>

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video Murojaat Card */}
        <div className="bg-[#0078D4] rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5" />
              <p className="text-xs uppercase tracking-wider opacity-80">
                VIDEO MUROJAAT
              </p>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Video murojaat yuklang
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Rahbariyatga video murojaat yuboring
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-full bg-white/10" />
        </div>

        {/* Monitoring Widget */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-[#47B13C]" />
            <span className="text-sm font-medium text-[#999]">Monitoring</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]">Jami videolar</span>
              <span className="text-sm font-semibold text-[#47B13C]">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]">Ko'rilgan</span>
              <span className="text-sm font-semibold text-[#0078D4]">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]">Yangi</span>
              <span className="text-sm font-semibold text-[#999]">3</span>
            </div>
          </div>
        </div>

        {/* Refresh Widget */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-5 h-5 text-[#0078D4]" />
            <span className="text-sm font-medium text-[#999]">
              Yangilashni so'rash
            </span>
          </div>
          <p className="text-sm text-[#1A1A1A] mb-3">
            Video murojaatlarni yangilash
          </p>
          <button className="text-sm text-[#0078D4] font-medium hover:underline">
            Yangilash
          </button>
        </div>
      </div>

      {/* Main Content: Video List + Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video List */}
        <div className="lg:col-span-1 space-y-2">
          {mockVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                selectedVideo.id === video.id
                  ? "bg-[#0078D4]/5 border border-[#0078D4]/20"
                  : "bg-white border border-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Thumbnail */}
              <div
                className="w-16 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: video.thumbnailColor }}
              >
                <Play className="w-4 h-4 text-[#666]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                  {video.userName}
                </p>
                <p className="text-xs text-[#999]">{video.role}</p>
                <p className="text-xs text-[#999] mt-0.5">{video.date}</p>
              </div>

              {/* Menu */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-[#999]" />
              </button>
            </div>
          ))}
        </div>

        {/* Player + Widgets */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player */}
          <div className="bg-[#1A1A1A] rounded-2xl aspect-video relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>

            {/* Player info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {selectedVideo.userName}
                  </p>
                  <p className="text-white/70 text-xs">
                    {selectedVideo.role} - {selectedVideo.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <Mic className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => {
                const idx = mockVideos.findIndex(
                  (v) => v.id === selectedVideo.id
                );
                if (idx > 0) setSelectedVideo(mockVideos[idx - 1]);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => {
                const idx = mockVideos.findIndex(
                  (v) => v.id === selectedVideo.id
                );
                if (idx < mockVideos.length - 1)
                  setSelectedVideo(mockVideos[idx + 1]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Si tahlil */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#47B13C]" />
                <span className="text-xs font-medium text-[#999]">
                  Si tahlil
                </span>
              </div>
              <p className="text-lg font-bold text-[#1A1A1A]">95%</p>
              <p className="text-xs text-[#47B13C]">Ijobiy natija</p>
            </div>

            {/* Currency */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#0078D4]" />
                <span className="text-xs font-medium text-[#999]">
                  Currency
                </span>
              </div>
              <p className="text-lg font-bold text-[#1A1A1A]">12,850</p>
              <p className="text-xs text-[#0078D4]">UZS/USD</p>
            </div>

            {/* Weather */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-[#999]" />
                <span className="text-xs font-medium text-[#999]">
                  Weather
                </span>
              </div>
              <p className="text-lg font-bold text-[#1A1A1A]">18°C</p>
              <p className="text-xs text-[#999]">Toshkent, bulutli</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
