import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle, MapPin, ArrowRight, Dumbbell } from "lucide-react";
import { useMembershipPlans } from "@/hooks/usePlans";

const HERO_FEATURES = ["World-class equipment", "Expert personal trainers", "100+ weekly classes", "Located across France"];

export default function VisitorHome() {
  const { t } = useTranslation(["common"]);
  const { data: plans = [] } = useMembershipPlans({ isPublic: true });

  return (
    <div className="min-h-screen bg-surface text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-gold-400" />
            <span className="font-bold text-lg text-white">OhMyGold</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
            <Link to="/visitor/pricing" className="hover:text-white">Pricing</Link>
            <Link to="/visitor/locations" className="hover:text-white flex items-center gap-1"><MapPin className="w-3 h-3" /> Locations</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-neutral-300 hover:text-white">Sign In</Link>
            <Link to="/auth/register" className="bg-gold-400 text-black font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gold-400/90 transition-colors">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-gold-400/10 border border-gold-400/30 text-gold-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🏆 Gold's Gym France — Now Powered by OhMyGold
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            The Premier<br />
            <span className="text-gold-400">Fitness</span> Experience
          </h1>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join thousands of members achieving their fitness goals at Gold's Gym France. Book classes, track progress, and transform your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="inline-flex items-center gap-2 bg-gold-400 text-black font-bold px-8 py-4 rounded-xl text-lg hover:bg-gold-400/90 transition-colors">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/visitor/locations" className="inline-flex items-center gap-2 border border-neutral-700 text-white px-8 py-4 rounded-xl text-lg hover:border-neutral-500 transition-colors">
              <MapPin className="w-5 h-5" /> Find a Gym
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {HERO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-neutral-400">
                <CheckCircle className="w-4 h-4 text-gold-400" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 px-4 bg-surface-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">Membership Plans</h2>
          <p className="text-neutral-400 text-center mb-12">Choose the plan that fits your goals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {((plans as Array<{ id: string; name: string; price: number; billing_interval: string; features: Record<string, boolean>; color?: string }>) as unknown as { id: string; name: string; price: number; billing_interval: string; features: Record<string, boolean>; color?: string }[]).map((plan, i) => (
              <div key={plan.id} className={`relative bg-surface-card border rounded-2xl p-8 flex flex-col ${i === 1 ? "border-gold-400 ring-1 ring-gold-400/30" : "border-neutral-800"}`}>
                {i === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-3xl font-black text-gold-400 mb-1">
                  {plan.price?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </p>
                <p className="text-neutral-500 text-sm mb-6">per {plan.billing_interval}</p>
                <div className="space-y-3 mb-8 flex-1">
                  {Object.entries(plan.features ?? {}).filter(([, v]) => v).map(([k]) => (
                    <div key={k} className="flex items-center gap-2 text-sm text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      {k.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
                <Link to="/auth/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${i === 1 ? "bg-gold-400 text-black hover:bg-gold-400/90" : "border border-neutral-700 text-white hover:border-neutral-500"}`}>
                  Get Started
                </Link>
              </div>
            ))}
            {(plans as unknown[]).length === 0 && (
              ["Basic", "Premium", "Elite"].map((name, i) => (
                <div key={name} className={`relative bg-surface-card border rounded-2xl p-8 flex flex-col ${i === 1 ? "border-gold-400" : "border-neutral-800"}`}>
                  {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-black text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</span>}
                  <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
                  <p className="text-3xl font-black text-gold-400 mb-1">{i === 0 ? "29,99 €" : i === 1 ? "49,99 €" : "79,99 €"}</p>
                  <p className="text-neutral-500 text-sm mb-6">per month</p>
                  <div className="space-y-2 mb-8 flex-1">
                    {["Unlimited gym access", ...(i > 0 ? ["Group classes"] : []), ...(i > 1 ? ["Personal training", "Pool access"] : [])].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-neutral-300"><CheckCircle className="w-4 h-4 text-green-400 shrink-0" />{f}</div>
                    ))}
                  </div>
                  <Link to="/auth/register" className={`block text-center py-3 rounded-xl font-semibold ${i === 1 ? "bg-gold-400 text-black" : "border border-neutral-700 text-white"}`}>Get Started</Link>
                </div>
              ))
            )}
          </div>
          <p className="text-center mt-8">
            <Link to="/visitor/pricing" className="text-gold-400 hover:underline text-sm">View full plan comparison →</Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create an account", desc: "Sign up in under 2 minutes with email or Google." },
              { step: "02", title: "Choose your plan", desc: "Select the membership that fits your goals and budget." },
              { step: "03", title: "Start training", desc: "Book classes, check in with your QR code, and track progress." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold-400 font-black text-xl">{s.step}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-neutral-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Ready to transform?</h2>
          <p className="text-neutral-400 mb-8">Join Gold's Gym France today and unlock your full potential.</p>
          <Link to="/auth/register" className="inline-flex items-center gap-2 bg-gold-400 text-black font-bold px-10 py-4 rounded-xl text-lg hover:bg-gold-400/90 transition-colors">
            Join Now — It's Free to Start <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-4 text-center text-neutral-600 text-sm">
        <p>© 2026 OhMyGold / Gold's Gym France. All rights reserved.</p>
      </footer>
    </div>
  );
}
