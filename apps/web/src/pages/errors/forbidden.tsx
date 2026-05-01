import { ShieldOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-5 bg-status-error/10 rounded-full">
            <ShieldOff className="w-12 h-12 text-status-error" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-6xl font-black text-gold-400">403</div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            You do not have permission to access this page.
            Contact your administrator if you believe this is an error.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-elevated text-white font-semibold text-sm hover:bg-surface-card border border-border transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Go back
        </button>
      </div>
    </div>
  );
}
