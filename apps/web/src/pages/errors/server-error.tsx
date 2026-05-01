import { ServerCrash, RefreshCw } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-5 bg-status-error/10 rounded-full">
            <ServerCrash className="w-12 h-12 text-status-error" aria-hidden="true" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-6xl font-black text-gold-400">500</div>
          <h1 className="text-2xl font-bold text-white">Server Error</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            An internal server error occurred. Our team has been notified.
            Please try again in a moment.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    </div>
  );
}
