import { useState } from "react";

const MOODS    = ["😄","😊","😐","😔","😩"];
const ENERGIES = ["⚡ High","🔆 Good","😐 OK","😴 Low","💀 Drained"];
const SYMPTOMS = ["Headache","Fatigue","Back pain","Joint pain","Nausea","Shortness of breath","Chest tightness","Brain fog","Anxiety","None"];

export default function CheckInModal({ onSave, onClose, sleepGoal }) {
  const [form, setForm] = useState({
    mood: null, energy: null, sleepHrs: "", weight: "",
    symptoms: [], note: "",
  });

  const toggleSymptom = (s) => {
    if (s === "None") return setForm({ ...form, symptoms: ["None"] });
    const without = form.symptoms.filter(x => x !== "None");
    setForm({ ...form, symptoms: without.includes(s) ? without.filter(x => x !== s) : [...without, s] });
  };

  const canSave = form.mood !== null && form.energy !== null && form.sleepHrs;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black">Daily Check-In</h2>
              <p className="text-gray-400 text-sm">How are you feeling today?</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl transition">×</button>
          </div>

          {/* Mood */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-300 mb-2">Mood</p>
            <div className="flex gap-3 justify-between">
              {MOODS.map((m, i) => (
                <button key={i} onClick={() => setForm({ ...form, mood: i })}
                  className={`text-3xl p-2 rounded-xl transition ${form.mood === i ? "bg-lime-400/20 border-2 border-lime-400 scale-110" : "bg-gray-800 border-2 border-transparent hover:border-gray-600"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-300 mb-2">Energy Level</p>
            <div className="grid grid-cols-3 gap-2">
              {ENERGIES.map((e, i) => (
                <button key={i} onClick={() => setForm({ ...form, energy: i })}
                  className={`text-sm py-2 px-3 rounded-xl transition ${form.energy === i ? "bg-lime-400 text-black font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-300 mb-1">Sleep Last Night</p>
            <p className="text-gray-500 text-xs mb-2">Recommended: {sleepGoal?.label}</p>
            <div className="flex items-center gap-3">
              <input type="number" step="0.5" min="0" max="24" placeholder="e.g. 7.5"
                value={form.sleepHrs} onChange={e => setForm({ ...form, sleepHrs: e.target.value })}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition" />
              <span className="text-gray-400">hrs</span>
            </div>
          </div>

          {/* Weight (optional) */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-300 mb-1">Weight <span className="text-gray-500 font-normal">(optional)</span></p>
            <div className="flex items-center gap-3">
              <input type="number" step="0.1" placeholder="e.g. 70.5"
                value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition" />
              <span className="text-gray-400">kg</span>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-300 mb-2">Any symptoms today?</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${form.symptoms.includes(s) ? "bg-red-400/20 border-red-400/60 text-red-300" : "border-gray-600 text-gray-400 hover:border-gray-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-300 mb-2">Note <span className="text-gray-500 font-normal">(optional)</span></p>
            <textarea rows={2} placeholder="Anything on your mind..."
              value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition resize-none text-sm" />
          </div>

          <button disabled={!canSave} onClick={() => onSave(form)}
            className={`w-full py-3 rounded-xl font-black text-lg transition ${canSave ? "bg-lime-400 text-black hover:bg-lime-300" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
            Save Check-In ✓
          </button>
        </div>
      </div>
    </div>
  );
}
