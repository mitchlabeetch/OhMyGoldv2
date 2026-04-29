import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-status-error/10 border border-status-error/20 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-status-error" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Accès refusé</h1>
        <p className="text-text-secondary text-sm mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page. Contactez votre
          administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated border border-border hover:border-border-emphasis text-white text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </motion.div>
    </div>
  );
}
