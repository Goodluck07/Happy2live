export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* ECG animation style */}
      <style>{`
        @keyframes ecg {
          0%   { stroke-dashoffset: 300; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        .ecg-line { stroke-dasharray: 300; animation: ecg 2s linear infinite; }
        .heart-pulse { animation: pulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          {/* Logo: two hands + heart + ECG */}
          <div className="flex items-center gap-1">
            <span className="text-2xl">🙌</span>
            <svg width="60" height="28" viewBox="0 0 60 28">
              <polyline className="ecg-line" points="0,14 8,14 12,4 16,24 20,14 28,14 30,10 32,14 40,14 44,6 48,22 52,14 60,14"
                fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="heart-pulse text-xl inline-block">❤️</span>
          </div>
          <span className="text-xl font-black text-lime-400">Happy2Live</span>
        </div>
        <button onClick={onGetStarted} className="bg-lime-400 text-black font-bold px-5 py-2 rounded-full hover:bg-lime-300 transition text-sm">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <div className="text-center px-4 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 bg-lime-400/10 border border-lime-400/30 rounded-full px-4 py-1.5 text-lime-300 text-sm mb-6">
          🏆 Built for Hackathon 2025
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
          Your Health,<br /><span className="text-lime-400">Your Way</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Track your body, eat smarter, connect with loved ones, and build lasting healthy habits — personalized for every age.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onGetStarted} className="bg-lime-400 text-black font-black text-lg px-10 py-4 rounded-full hover:bg-lime-300 transition shadow-lg shadow-lime-400/20">
            Start Your Journey →
          </button>
          <button onClick={onGetStarted} className="border border-gray-600 text-gray-300 font-bold text-lg px-10 py-4 rounded-full hover:border-lime-400 hover:text-lime-400 transition">
            Sign In
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex justify-center gap-8 md:gap-16 py-6 border-y border-gray-800 mb-10 px-4">
        {[
          { value:"All Ages", label:"Kids to Seniors" },
          { value:"8 Tabs",   label:"Health Features" },
          { value:"Science",  label:"Backed Calculations" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-black text-lime-400">{s.value}</p>
            <p className="text-gray-400 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-6 pb-20">
        {[
          { icon:"🫀", title:"Body Tracking",    desc:"BMI, BMR, TDEE, heart rate zones — all calculated from your real data" },
          { icon:"🧬", title:"Body Analysis",     desc:"Interactive body model, age-adaptive, with clickable part insights" },
          { icon:"🥗", title:"Meal Planner",      desc:"Personalized recipes & nutrition based on your food preferences" },
          { icon:"💪", title:"Workout Logger",    desc:"Log workouts, track calories burned, and monitor weekly activity" },
          { icon:"👨‍👩‍👧", title:"Family Connect",   desc:"Share goals, track progress together with friends & family" },
          { icon:"🎙️", title:"Health Podcasts",   desc:"Spotify, Apple Podcasts & age-curated health content" },
          { icon:"📚", title:"Health Education",  desc:"Evidence-based articles tailored to your age group" },
          { icon:"💧", title:"Hydration Tracker", desc:"Water goal calculated from your body weight, log in real time" },
          { icon:"😴", title:"Sleep Insights",    desc:"CDC-recommended sleep targets with weekly trend charts" },
        ].map(f => (
          <div key={f.title} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-lime-400/50 transition">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-white mb-1 text-sm md:text-base">{f.title}</h3>
            <p className="text-gray-400 text-xs md:text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center pb-10">
        <button onClick={onGetStarted} className="bg-lime-400 text-black font-black px-10 py-4 rounded-full hover:bg-lime-300 transition text-lg">
          Create Free Account →
        </button>
      </div>
    </div>
  );
}
