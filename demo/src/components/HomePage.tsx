import { Monitor, Smartphone, Zap } from "lucide-react";
import type { Platform } from "../App";

interface Props {
  onSelect: (platform: Platform) => void;
}

export default function HomePage({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #FBBF24 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.04)_0%,_transparent_60%)]" />
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center mb-12 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gold-400 flex items-center justify-center gold-glow">
            <Zap className="w-7 h-7 text-[#0A0A0A]" fill="#0A0A0A" />
          </div>
          <span className="text-3xl font-black tracking-tight text-white">
            Oh<span className="text-gold-400">My</span>Gold
          </span>
        </div>
        <div className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-xs font-semibold tracking-widest uppercase">
          Demo Interactive
        </div>
      </div>

      {/* Headline */}
      <div className="relative text-center mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
          Découvrez{" "}
          <span className="text-gold-400 relative">
            OhMyGold
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 8"
              fill="none"
            >
              <path
                d="M0 6 Q75 2 150 5 Q225 8 300 4"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </span>
        </h1>
      </div>

      <p
        className="relative text-white/50 text-lg text-center mb-16 max-w-md animate-slide-up"
        style={{ animationDelay: "0.15s" }}
      >
        La plateforme de gestion de salle de sport nouvelle génération pour Gold's Gym France
      </p>

      {/* Platform cards */}
      <div
        className="relative flex flex-col sm:flex-row gap-6 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <button
          onClick={() => onSelect("mobile")}
          className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface-200 border border-white/5 hover:border-gold-400/50 card-hover w-64 text-left cursor-pointer"
        >
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-gold-400/5 to-transparent" />
          <div className="w-20 h-20 rounded-2xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-colors duration-300">
            <Smartphone className="w-10 h-10 text-gold-400" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Application Mobile</h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Expérience iOS/Android pour membres et coachs
            </p>
          </div>
          <div className="flex items-center gap-2 text-gold-400 text-sm font-semibold mt-auto">
            Explorer
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          onClick={() => onSelect("web")}
          className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl bg-surface-200 border border-white/5 hover:border-gold-400/50 card-hover w-64 text-left cursor-pointer"
        >
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-gold-400/5 to-transparent" />
          <div className="w-20 h-20 rounded-2xl bg-gold-400/10 flex items-center justify-center group-hover:bg-gold-400/20 transition-colors duration-300">
            <Monitor className="w-10 h-10 text-gold-400" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Interface Web</h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Dashboard complet pour gérants et personnel
            </p>
          </div>
          <div className="flex items-center gap-2 text-gold-400 text-sm font-semibold mt-auto">
            Explorer
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Footer */}
      <p className="relative mt-16 text-white/20 text-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
        © 2025 OhMyGold · Gold's Gym France
      </p>
    </div>
  );
}
