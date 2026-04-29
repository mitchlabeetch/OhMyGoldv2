import { useState } from "react";
import { useParams } from "react-router-dom";
import { Check, X, Clock, Send, AlertTriangle } from "lucide-react";

const mockClass = {
  id: "1",
  name: "Yoga Flow",
  time: "09:00",
  date: "2025-01-20",
  room: "Studio A",
  capacity: 15,
  roster: [
    { id: "m1", name: "Alice Martin", initials: "AM", status: "present" as const },
    { id: "m2", name: "Bob Dupont", initials: "BD", status: "absent" as const },
    { id: "m3", name: "Claire Petit", initials: "CP", status: "late" as const },
    { id: "m4", name: "David Moreau", initials: "DM", status: "present" as const },
    { id: "m5", name: "Emma Bernard", initials: "EB", status: "present" as const },
  ],
};

type AttendanceStatus = "present" | "absent" | "late";

export default function TeacherClassDetailPage() {
  const { id } = useParams();
  const [roster, setRoster] = useState(mockClass.roster);
  const [showCancel, setShowCancel] = useState(false);
  const [message, setMessage] = useState("");

  const updateStatus = (memberId: string, status: AttendanceStatus) => {
    setRoster((prev) => prev.map((m) => m.id === memberId ? { ...m, status } : m));
  };

  const statusConfig = {
    present: { label: "Présent", color: "bg-green-900 text-green-300", icon: Check },
    absent: { label: "Absent", color: "bg-red-900 text-red-300", icon: X },
    late: { label: "En retard", color: "bg-yellow-900 text-yellow-300", icon: Clock },
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">{mockClass.name}</h1>
        <p className="text-gray-400">{mockClass.date} · {mockClass.time} · {mockClass.room}</p>
        <p className="text-gray-400">{roster.length}/{mockClass.capacity} inscrits</p>
      </div>

      {/* Roster with attendance */}
      <div className="bg-surface-2 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Liste des présences</h2>
        <div className="space-y-3">
          {roster.map((member) => {
            const cfg = statusConfig[member.status];
            return (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-400 flex items-center justify-center text-black font-bold text-sm">
                    {member.initials}
                  </div>
                  <span className="text-white font-medium">{member.name}</span>
                </div>
                <div className="flex gap-2">
                  {(["present", "absent", "late"] as AttendanceStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(member.id, s)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${member.status === s ? statusConfig[s].color : "bg-surface-3 text-gray-400 hover:bg-surface-3"}`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send message */}
      <div className="bg-surface-2 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Message aux inscrits</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez un message à tous les inscrits..."
          className="w-full bg-surface rounded-lg p-3 text-white placeholder-gray-500 border border-surface-3 resize-none h-24"
        />
        <button className="mt-2 btn-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Envoyer
        </button>
      </div>

      {/* Cancel class */}
      <div>
        <button onClick={() => setShowCancel(true)} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
          <AlertTriangle className="w-4 h-4" /> Annuler ce cours
        </button>
      </div>

      {showCancel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-surface-2 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Annuler le cours ?</h3>
            <p className="text-gray-400 mb-4">Les {roster.length} inscrits seront notifiés de l'annulation.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 btn-secondary">Non, garder</button>
              <button className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2 font-medium transition-colors">
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
