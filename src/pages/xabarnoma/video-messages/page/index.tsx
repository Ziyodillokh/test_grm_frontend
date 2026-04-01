import { useState, useRef } from "react";
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
  Pause,
} from "lucide-react";

import { minio_img_url } from "@/constants";
import { Spinner } from "@/components/ui/spinner";

import UploadModal from "../components/upload-modal";
import { useVideoMessages, VideoMessage } from "../queries";

/** Format ISO date string to human-readable format */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export default function VideoMessagesPage() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useVideoMessages();
  const videos: VideoMessage[] = data?.items ?? [];

  const [selectedVideo, setSelectedVideo] = useState<VideoMessage | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-select first video when data loads
  const activeVideo =
    selectedVideo ?? (videos.length > 0 ? videos[0] : null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const navigateVideo = (direction: "prev" | "next") => {
    if (!activeVideo || videos.length === 0) return;
    const idx = videos.findIndex((v) => v.id === activeVideo.id);
    if (direction === "prev" && idx > 0) {
      setSelectedVideo(videos[idx - 1]);
      setIsPlaying(false);
    }
    if (direction === "next" && idx < videos.length - 1) {
      setSelectedVideo(videos[idx + 1]);
      setIsPlaying(false);
    }
  };

  const senderName = (v: VideoMessage) =>
    v.sender
      ? `${v.sender.firstName} ${v.sender.lastName}`
      : "Noma'lum";

  const senderRole = (v: VideoMessage) =>
    v.sender?.position?.title ?? "";

  // ---------- Monitoring counts ----------
  const totalVideos = videos.length;

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
              <span className="text-sm font-semibold text-[#47B13C]">
                {totalVideos}
              </span>
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
          <button
            onClick={() => refetch()}
            className="text-sm text-[#0078D4] font-medium hover:underline"
          >
            Yangilash
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-8 h-8 text-[#0078D4]" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Video className="w-12 h-12 text-[#999] mb-3" />
          <p className="text-sm text-[#999]">
            Hozircha video murojaatlar yo'q
          </p>
        </div>
      )}

      {/* Main Content: Video List + Player */}
      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video List */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  activeVideo?.id === video.id
                    ? "bg-[#0078D4]/5 border border-[#0078D4]/20"
                    : "bg-white border border-gray-100 hover:border-gray-200"
                }`}
              >
                {/* Avatar / Thumbnail */}
                <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center">
                  {video.sender?.avatar ? (
                    <img
                      src={minio_img_url + video.sender.avatar}
                      alt={senderName(video)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-[#666]">
                      {video.sender?.firstName?.[0] ?? "?"}
                      {video.sender?.lastName?.[0] ?? ""}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                    {senderName(video)}
                  </p>
                  <p className="text-xs text-[#999]">{senderRole(video)}</p>
                  <p className="text-xs text-[#999] mt-0.5">
                    {formatDate(video.createdAt)}
                  </p>
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

          {/* Player */}
          <div className="lg:col-span-2 space-y-4">
            {activeVideo && (
              <div className="bg-[#1A1A1A] rounded-2xl aspect-video relative overflow-hidden">
                <video
                  ref={videoRef}
                  key={activeVideo.id}
                  src={minio_img_url + activeVideo.videoPath}
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Play / Pause overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={handlePlayPause}
                      className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                )}

                {isPlaying && (
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                  >
                    <span className="sr-only">Pause</span>
                  </button>
                )}

                {/* Player info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {senderName(activeVideo)}
                      </p>
                      <p className="text-white/70 text-xs">
                        {senderRole(activeVideo)} -{" "}
                        {formatDate(activeVideo.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pointer-events-auto">
                      <button
                        onClick={handlePlayPause}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => navigateVideo("prev")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => navigateVideo("next")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
