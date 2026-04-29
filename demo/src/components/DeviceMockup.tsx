import { ArrowLeft, Home, Zap } from "lucide-react";
import type { Platform, Role } from "../App";

interface Props {
  platform: Platform;
  role: Role;
  onBack: () => void;
  onHome: () => void;
  children: React.ReactNode;
}

const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur",
  manager: "Gestionnaire",
  receptionniste: "Réceptionniste",
  coach: "Coach",
  membre: "Membre",
  visiteur: "Visiteur",
};

export default function DeviceMockup({ platform, role, onBack, onHome, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-[#0A0A0A]">
      {/* Top bar */}
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 animate-fade-in">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold-400 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#0A0A0A]" fill="#0A0A0A" />
          </div>
          <span className="font-black text-white text-sm">
            Oh<span className="text-gold-400">My</span>Gold
          </span>
          <span className="text-white/20">·</span>
          <span className="text-white/40 text-sm">{ROLE_LABELS[role]}</span>
        </div>

        <button
          onClick={onHome}
          className="flex items-center gap-2 text-white/40 hover:text-gold-400 transition-colors group"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm">Accueil</span>
        </button>
      </div>

      {/* Device frame */}
      {platform === "web" ? (
        <LaptopFrame>{children}</LaptopFrame>
      ) : (
        <PhoneFrame>{children}</PhoneFrame>
      )}
    </div>
  );
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center animate-slide-up">
      {/* Screen bezel */}
      <div
        className="relative device-shadow"
        style={{
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          borderRadius: "16px 16px 0 0",
          padding: "12px 12px 0 12px",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Camera dot */}
        <div className="flex justify-center mb-3">
          <div className="w-2 h-2 rounded-full bg-[#2a2a2a] border border-white/10" />
        </div>

        {/* Screen area */}
        <div
          className="relative overflow-hidden"
          style={{
            width: "min(1100px, calc(100vw - 80px))",
            height: "min(680px, calc(100vh - 280px))",
            background: "#0A0A0A",
            borderRadius: "4px 4px 0 0",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>

      {/* Laptop base */}
      <div
        style={{
          width: "min(1200px, calc(100vw - 40px))",
          height: "20px",
          background: "linear-gradient(180deg, #252525, #1a1a1a)",
          borderRadius: "0 0 8px 8px",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: "none",
        }}
      />
      <div
        style={{
          width: "min(1300px, calc(100vw - 20px))",
          height: "6px",
          background: "linear-gradient(180deg, #1a1a1a, #141414)",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      />
      {/* Gold line accent */}
      <div className="mt-6 w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent rounded-full" />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center animate-slide-up">
      <div
        className="relative device-shadow gold-glow-sm"
        style={{
          width: "min(390px, calc(100vw - 40px))",
          background: "linear-gradient(145deg, #252525, #1a1a1a)",
          borderRadius: "54px",
          padding: "14px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Side buttons */}
        <div
          className="absolute left-[-3px] top-[120px] w-1 h-10 bg-[#2a2a2a] rounded-l-full border-l border-white/10"
        />
        <div
          className="absolute left-[-3px] top-[170px] w-1 h-14 bg-[#2a2a2a] rounded-l-full border-l border-white/10"
        />
        <div
          className="absolute left-[-3px] top-[200px] w-1 h-14 bg-[#2a2a2a] rounded-l-full border-l border-white/10"
        />
        <div
          className="absolute right-[-3px] top-[150px] w-1 h-20 bg-[#2a2a2a] rounded-r-full border-r border-white/10"
        />

        {/* Screen */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "44px",
            height: "min(820px, calc(100vh - 200px))",
            background: "#0A0A0A",
          }}
        >
          {/* Dynamic island / notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-white/10" />
            <div className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-white/10" />
          </div>

          {/* Content */}
          <div className="w-full h-full overflow-auto pt-12">{children}</div>

          {/* Bottom indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
        </div>
      </div>
      <div className="mt-6 w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent rounded-full" />
    </div>
  );
}
