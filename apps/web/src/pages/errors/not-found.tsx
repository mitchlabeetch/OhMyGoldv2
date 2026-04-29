import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-black text-gradient-gold mb-4">404</div>
        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page introuvable</h1>
        <p className="text-text-secondary text-sm mb-6">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-black text-sm font-semibold hover:from-gold-400 hover:to-gold-500 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
