import { useNavigate } from "react-router-dom";
import {
  Bell,
  ArrowRight,
  Plus,
  Activity,
  RefreshCw,
  FileText,
  Package,
  Video,
  HelpCircle,
} from "lucide-react";

export default function NotificationsPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      title: "Transferlar",
      description: "Transfer xabarnomalarini ko'rish",
      icon: FileText,
      path: "/transfers",
      count: 12,
    },
    {
      id: 2,
      title: "Partiyalar",
      description: "Partiya xabarnomalarini ko'rish",
      icon: Package,
      path: "/parties",
      count: 5,
    },
    {
      id: 3,
      title: "Video murojaatlar",
      description: "Video murojaatlarni ko'rish",
      icon: Video,
      path: "/xabarnoma/video-murojaatlar",
      count: 3,
    },
    {
      id: 4,
      title: "Boshqa",
      description: "Qo'shimcha xabarnomalar",
      icon: HelpCircle,
      path: "#",
      count: 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0078D4] flex items-center justify-center">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Xabarnoma</h1>
      </div>

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create Notification Card */}
        <div className="bg-[#0078D4] rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
              XABARNOMA YARATISH
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Yangi xabarnoma yarating
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Xodimlar va filiallar uchun xabarnoma yuboring
            </p>
            <button className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
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
              <span className="text-sm text-[#1A1A1A]">Yuborilgan</span>
              <span className="text-sm font-semibold text-[#47B13C]">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]">O'qilgan</span>
              <span className="text-sm font-semibold text-[#0078D4]">18</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1A1A1A]">Kutilmoqda</span>
              <span className="text-sm font-semibold text-[#999]">6</span>
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
            Ma'lumotlarni yangilash uchun so'rov yuboring
          </p>
          <button className="text-sm text-[#0078D4] font-medium hover:underline">
            Yangilash
          </button>
        </div>
      </div>

      {/* List Items */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#0078D4]/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#999]">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.count > 0 && (
                <span className="text-xs font-medium bg-[#0078D4]/10 text-[#0078D4] px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
              <ArrowRight className="w-4 h-4 text-[#999]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
