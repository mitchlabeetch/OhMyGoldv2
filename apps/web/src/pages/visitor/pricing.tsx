import { Link } from "react-router-dom";
import { CheckCircle, X } from "lucide-react";
import { useMembershipPlans } from "@/hooks/usePlans";

const DEFAULT_PLANS = [
  { id: "basic", name: "Basic", price: 29.99, billing_interval: "month", features: { "Unlimited gym access": true, "Locker room": true, "Group classes": false, "Pool access": false, "Personal training": false } },
  { id: "premium", name: "Premium", price: 49.99, billing_interval: "month", features: { "Unlimited gym access": true, "Locker room": true, "Group classes": true, "Pool access": true, "Personal training": false } },
  { id: "elite", name: "Elite", price: 79.99, billing_interval: "month", features: { "Unlimited gym access": true, "Locker room": true, "Group classes": true, "Pool access": true, "Personal training": true } },
];

const ALL_FEATURES = ["Unlimited gym access", "Locker room", "Group classes", "Pool access", "Personal training"];

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel with 30 days notice. Your access continues until the end of the billing period." },
  { q: "Is there a trial period?", a: "New members can request a 3-day trial pass at any Gold's Gym France location." },
  { q: "Can I freeze my membership?", a: "Yes, you can freeze for up to 30 days per year via the app or by contacting reception." },
  { q: "Are all locations included?", a: "Yes, all plans include access to any Gold's Gym France location." },
];

export default function VisitorPricing() {
  const { data: plans = [] } = useMembershipPlans({ isPublic: true });
  const displayPlans = (plans as unknown[]).length > 0 ? plans : DEFAULT_PLANS;

  return (
    <div className="min-h-screen bg-surface text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/visitor" className="font-bold text-lg text-white">OhMyGold</Link>
          <div className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-neutral-300 hover:text-white">Sign In</Link>
            <Link to="/auth/register" className="bg-gold-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">Join Now</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black text-center mb-4">Simple, Transparent Pricing</h1>
          <p className="text-neutral-400 text-center mb-16 text-lg">No hidden fees. Cancel anytime.</p>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {(displayPlans as Array<{ id: string; name: string; price: number; billing_interval: string; features: Record<string, boolean> }>).map((plan, i) => (
              <div key={plan.id} className={`relative bg-surface-card border rounded-2xl p-8 flex flex-col ${i === 1 ? "border-gold-400 ring-1 ring-gold-400/20 scale-105" : "border-neutral-800"}`}>
                {i === 1 && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-400 text-black text-xs font-bold px-4 py-1 rounded-full">BEST VALUE</span>}
                <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-gold-400">{typeof plan.price === "number" ? plan.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }) : plan.price}</span>
                  <span className="text-neutral-500 text-sm"> / {plan.billing_interval}</span>
                </div>
                <div className="space-y-3 flex-1 mb-8">
                  {ALL_FEATURES.map((f) => {
                    const included = plan.features?.[f] ?? false;
                    return (
                      <div key={f} className="flex items-center gap-3 text-sm">
                        {included ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> : <X className="w-4 h-4 text-neutral-700 shrink-0" />}
                        <span className={included ? "text-white" : "text-neutral-600"}>{f}</span>
                      </div>
                    );
                  })}
                </div>
                <Link to="/auth/register"
                  className={`block text-center py-3.5 rounded-xl font-semibold transition-colors ${i === 1 ? "bg-gold-400 text-black hover:bg-gold-400/90" : "border border-neutral-700 text-white hover:border-neutral-500"}`}>
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Feature matrix */}
          <div className="bg-surface-card border border-neutral-800 rounded-2xl overflow-hidden mb-16">
            <h2 className="text-xl font-bold p-6 border-b border-neutral-800">Full Feature Comparison</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left p-4 text-neutral-400 font-medium">Feature</th>
                  {(displayPlans as Array<{ name: string }>).map((p) => <th key={p.name} className="p-4 text-center text-white font-semibold">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((f) => (
                  <tr key={f} className="border-b border-neutral-800/50 last:border-0">
                    <td className="p-4 text-neutral-300">{f}</td>
                    {(displayPlans as Array<{ id: string; features: Record<string, boolean> }>).map((p) => (
                      <td key={p.id} className="p-4 text-center">
                        {p.features?.[f] ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-neutral-700 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <div key={item.q} className="bg-surface-card border border-neutral-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                  <p className="text-neutral-400 text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
