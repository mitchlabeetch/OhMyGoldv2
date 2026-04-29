import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";

export default function VisitorLocations() {
  const { data: locations = [], isLoading } = useLocations();

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
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Our Locations</h1>
            <p className="text-neutral-400 text-lg">Find your nearest Gold's Gym France</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-surface-card rounded-2xl animate-pulse" />)}
            </div>
          ) : (locations as unknown[]).length === 0 ? (
            // Placeholder locations
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Gold's Gym Paris République", address: "15 Boulevard du Temple", city: "Paris", phone: "+33 1 42 00 00 01", hours: "06:00 – 23:00" },
                { name: "Gold's Gym Lyon Part-Dieu", address: "23 Rue de la Villette", city: "Lyon", phone: "+33 4 72 00 00 02", hours: "06:00 – 22:00" },
                { name: "Gold's Gym Marseille Prado", address: "45 Avenue du Prado", city: "Marseille", phone: "+33 4 91 00 00 03", hours: "07:00 – 22:00" },
                { name: "Gold's Gym Bordeaux", address: "8 Cours de la Somme", city: "Bordeaux", phone: "+33 5 56 00 00 04", hours: "06:00 – 22:00" },
                { name: "Gold's Gym Toulouse Capitole", address: "12 Rue du Taur", city: "Toulouse", phone: "+33 5 61 00 00 05", hours: "06:00 – 22:00" },
                { name: "Gold's Gym Nice Promenade", address: "3 Promenade des Anglais", city: "Nice", phone: "+33 4 93 00 00 06", hours: "07:00 – 21:00" },
              ].map((loc) => (
                <div key={loc.name} className="bg-surface-card border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors">
                  <div className="h-36 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                      <p className="text-gold-400 font-bold text-sm">GOLD'S GYM</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-white font-bold">{loc.name}</h3>
                    <p className="text-neutral-400 text-sm flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 shrink-0" />{loc.address}, {loc.city}</p>
                    <p className="text-neutral-400 text-sm flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" />{loc.phone}</p>
                    <p className="text-neutral-400 text-sm flex items-center gap-1.5"><Clock className="w-3 h-3 shrink-0" />{loc.hours}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.address + " " + loc.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold-400 text-sm hover:underline mt-2">
                      <ExternalLink className="w-3 h-3" /> Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(locations as Array<{ id: string; name: string; address: string; city: string; phone?: string; email?: string }>).map((loc) => (
                <div key={loc.id} className="bg-surface-card border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors">
                  <div className="h-36 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gold-400" />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-white font-bold">{loc.name}</h3>
                    <p className="text-neutral-400 text-sm flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 shrink-0" />{loc.address}, {loc.city}</p>
                    {loc.phone && <p className="text-neutral-400 text-sm flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" />{loc.phone}</p>}
                    {loc.email && <p className="text-neutral-400 text-sm flex items-center gap-1.5"><Mail className="w-3 h-3 shrink-0" />{loc.email}</p>}
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.address + " " + loc.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold-400 text-sm hover:underline mt-2">
                      <ExternalLink className="w-3 h-3" /> Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
