import { calcHealthScore } from "../utils/health";

function ScoreArc({ score }) {
  const size = 140;
  const r = 54;
  const circ = Math.PI * r; // half circle
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#a3e635" : score >= 60 ? "#facc15" : score >= 40 ? "#f97316" : "#f87171";

  return (
    <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
      {/* Track */}
      <path d={`M 10,${size/2} A ${r},${r} 0 0 1 ${size-10},${size/2}`}
        fill="none" stroke="#374151" strokeWidth={12} strokeLinecap="round" />
      {/* Score arc */}
      <path d={`M 10,${size/2} A ${r},${r} 0 0 1 ${size-10},${size/2}`}
        fill="none" stroke={color} strokeWidth={12} strokeLinecap="round"
        strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }} />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fill="white" fontSize={28} fontWeight="bold">{score}</text>
      <text x={size/2} y={size/2 + 16} textAnchor="middle" fill="#9ca3af" fontSize={11}>out of 100</text>
    </svg>
  );
}

export default function HealthScore({ bmi, stepsToday, stepGoal, sleepHrs, sleepGoal, waterPct, bpSystolic, spo2, checkInStreak }) {
  const score = calcHealthScore({ bmi, stepsToday, stepGoal, sleepHrs, sleepGoal, waterPct, bpSystolic, spo2, checkInStreak });
  const label = score >= 80 ? "Excellent 🌟" : score >= 65 ? "Good 👍" : score >= 50 ? "Fair 📈" : score >= 35 ? "Needs Work 💪" : "Get Started 🚀";
  const color = score >= 80 ? "text-lime-400" : score >= 65 ? "text-blue-400" : score >= 50 ? "text-yellow-400" : score >= 35 ? "text-orange-400" : "text-red-400";

  const factors = [
    { label: "BMI",          done: !!bmi,          tip: "Calculate in Body tab" },
    { label: "Steps",        done: stepsToday > 0, tip: "Log your activity" },
    { label: "Sleep",        done: sleepHrs > 0,   tip: "Log via daily check-in" },
    { label: "Hydration",    done: waterPct > 0.5, tip: "Track water intake" },
    { label: "Blood Pressure", done: !!bpSystolic, tip: "Log in Vitals tab" },
    { label: "SpO₂",         done: !!spo2,         tip: "Log in Vitals tab" },
    { label: "Check-in Streak", done: checkInStreak > 0, tip: "Do a daily check-in" },
  ];

  const missing = factors.filter(f => !f.done);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
      <h3 className="font-bold mb-3">Health Score</h3>
      <div className="flex flex-col items-center">
        <ScoreArc score={score} />
        <p className={`font-black text-lg mt-1 ${color}`}>{label}</p>
        <p className="text-gray-400 text-xs text-center mt-1 max-w-xs">
          Composite score based on BMI, steps, sleep, hydration, blood pressure, SpO₂, and check-in consistency.
        </p>
      </div>

      {missing.length > 0 && (
        <div className="mt-4 border-t border-gray-700 pt-3">
          <p className="text-gray-500 text-xs font-bold mb-2">TO IMPROVE YOUR SCORE:</p>
          <div className="space-y-1.5">
            {missing.slice(0, 3).map(f => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-gray-600">○</span>
                <span>{f.label}</span>
                <span className="text-gray-600">—</span>
                <span className="text-lime-400/80">{f.tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {factors.map(f => (
          <span key={f.label} className={`text-xs px-2 py-0.5 rounded-full ${f.done ? "bg-lime-400/20 text-lime-300" : "bg-gray-700 text-gray-500"}`}>
            {f.done ? "✓" : "○"} {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
