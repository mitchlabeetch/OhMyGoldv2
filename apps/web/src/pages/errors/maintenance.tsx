import { Wrench, Clock } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-5 bg-gold-500/10 rounded-full">
            <Wrench className="w-12 h-12 text-gold-400" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Under Maintenance</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            We are performing scheduled maintenance to improve your experience.
            We will be back shortly.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
          <Clock className="w-4 h-4" aria-hidden="true" />
          Estimated downtime: up to 30 minutes
        </div>
        <div className="pt-2">
          <div className="text-3xl font-black text-gold-400">GOLD'S GYM</div>
          <div className="text-xs text-text-muted mt-1">Thank you for your patience.</div>
        </div>
      </div>
    </div>
  );
}
