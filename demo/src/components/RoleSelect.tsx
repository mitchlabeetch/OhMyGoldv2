import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import type { Platform, Role } from "../App";

interface Props {
  platform: Platform;
  onSelect: (role: Role) => void;
  onBack: () => void;
}

const ROLES = [
  {
    id: "admin" as Role,
    icon: "🛡️",
    name: "Administrateur",
    description: "Accès complet, multi-clubs",
    platforms: ["web"],
    color: "from-purple-500/10 to-purple-500/5",
    border: "hover:border-purple-400/50",
    badge: "bg-purple-400/10 text-purple-300",
  },
  {
    id: "manager" as Role,
    icon: "📊",
    name: "Gestionnaire",
    description: "Pilotez votre club",
    platforms: ["web"],
    color: "from-blue-500/10 to-blue-500/5",
    border: "hover:border-blue-400/50",
    badge: "bg-blue-400/10 text-blue-300",
  },
  {
    id: "receptionniste" as Role,
    icon: "🏷️",
    name: "Réceptionniste",
    description: "Accueil et caisse",
    platforms: ["web"],
    color: "from-green-500/10 to-green-500/5",
    border: "hover:border-green-400/50",
    badge: "bg-green-400/10 text-green-300",
  },
  {
    id: "coach" as Role,
    icon: "🏋️",
    name: "Coach",
    description: "Gérez vos cours",
    platforms: ["web"],
    color: "from-orange-500/10 to-orange-500/5",
    border: "hover:border-orange-400/50",
    badge: "bg-orange-400/10 text-orange-300",
  },
  {
    id: "membre" as Role,
    icon: "👤",
    name: "Membre",
    description: "Votre espace fitness",
    platforms: ["mobile", "web"],
    color: "from-gold-400/10 to-gold-400/5",
    border: "hover:border-gold-400/50",
    badge: "bg-gold-400/10 text-gold-300",
  },
  {
    id: "visiteur" as Role,
    icon: "👁️",
    name: "Visiteur",
    description: "Découvrez nos offres",
    platforms: ["mobile", "web"],
    color: "from-teal-500/10 to-teal-500/5",
    border: "hover:border-teal-400/50",
    badge: "bg-teal-400/10 text-teal-300",
  },
];

export default function RoleSelect({ platform, onSelect, onBack }: Props) {
  const platformIcon = platform === "web" ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />;
  const platformLabel = platform === "web" ? "Interface Web" : "Application Mobile";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Header */}
      <div className="w-full max-w-3xl mb-10 animate-slide-up">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-xs font-semibold">
            {platformIcon}
            {platformLabel}
          </div>
        </div>
        <h1 className="text-4xl font-black text-white">Choisissez votre rôle</h1>
        <p className="text-white/40 mt-2">
          Explorez l'interface selon votre profil utilisateur
        </p>
      </div>

      {/* Role grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {ROLES.map((role, i) => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={`group relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-surface-200 border border-white/5 ${role.border} card-hover text-left cursor-pointer animate-slide-up`}
            style={{ animationDelay: `${0.05 * i}s` }}
          >
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${role.color}`} />
            <div className="text-3xl">{role.icon}</div>
            <div>
              <h3 className="text-base font-bold text-white">{role.name}</h3>
              <p className="text-white/40 text-sm">{role.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-auto">
              {role.platforms.map((p) => (
                <span key={p} className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.badge}`}>
                  {p === "web" ? "Web" : "Mobile"}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
