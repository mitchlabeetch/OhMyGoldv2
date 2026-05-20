import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setSession = useAuthStore((s) => s.setSession);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate("/auth/login?error=oauth_failed", { replace: true });
        return;
      }

      setUser(data.session.user);
      setSession(data.session);
      await fetchProfile(data.session.user.id);
      navigate("/dashboard", { replace: true });
    };

    handleCallback();
  }, [navigate, setUser, setSession, fetchProfile]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400 mx-auto mb-4" />
        <p className="text-text-secondary text-sm">Connexion en cours…</p>
      </div>
    </div>
  );
}
