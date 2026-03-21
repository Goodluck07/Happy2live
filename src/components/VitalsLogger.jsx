import { useState } from "react";
import { assessBloodPressure, assessSpO2 } from "../utils/health";

export default function VitalsLogger({ onSave }) {
  const [form, setForm] = useState({ systolic: "", diastolic: "", spo2: "", heartRate: "" });
  const [saved, setSaved] = useState(false);

  const bp  = form.systolic && form.diastolic ? assessBloodPressure(form.systolic, form.diastolic) : null;
  const sp  = form.spo2 ? assessSpO2(form.spo2) : null;

  const save = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🩺</span>
        <h3 className="font-bold">Log Today's Vitals</h3>
        <span className="text-xs text-gray-500 ml-1">Enter readings from your home devices</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Blood pressure */}
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Systolic (mmHg)</label>
          <input type="number" placeholder="e.g. 120" value={form.systolic}
            onChange={e => setForm({ ...form, systolic: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Diastolic (mmHg)</label>
          <input type="number" placeholder="e.g. 80" value={form.diastolic}
            onChange={e => setForm({ ...form, diastolic: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">SpO₂ (%)</label>
          <input type="number" placeholder="e.g. 98" min="80" max="100" value={form.spo2}
            onChange={e => setForm({ ...form, spo2: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">Resting Heart Rate</label>
          <input type="number" placeholder="e.g. 68" value={form.heartRate}
            onChange={e => setForm({ ...form, heartRate: e.target.value })} className={inputCls} />
        </div>
      </div>

      {/* Live feedback */}
      {(bp || sp) && (
        <div className="space-y-2">
          {bp && (
            <div className={`flex items-center justify-between rounded-xl px-4 py-2 border ${bp.label.includes("High") ? "bg-red-400/10 border-red-400/30" : "bg-lime-400/10 border-lime-400/30"}`}>
              <span className="text-sm text-gray-300">Blood Pressure: <span className={`font-bold ${bp.color}`}>{bp.label}</span></span>
              <span className="text-xs text-gray-400">{form.systolic}/{form.diastolic}</span>
            </div>
          )}
          {sp && (
            <div className={`flex items-center justify-between rounded-xl px-4 py-2 border ${sp.label === "Critical" ? "bg-red-400/10 border-red-400/30" : "bg-lime-400/10 border-lime-400/30"}`}>
              <span className="text-sm text-gray-300">SpO₂: <span className={`font-bold ${sp.color}`}>{sp.label}</span></span>
              <span className="text-xs text-gray-400">{form.spo2}%</span>
            </div>
          )}
        </div>
      )}

      {saved && <p className="text-lime-400 text-sm font-medium">✅ Vitals saved!</p>}
      <button onClick={save} className="w-full bg-lime-400 text-black font-bold py-2.5 rounded-xl hover:bg-lime-300 transition">
        Save Vitals
      </button>

      <p className="text-gray-600 text-xs text-center">
        ⚠️ For reference only. Not a substitute for professional medical advice.
      </p>
    </div>
  );
}
