export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🫶</span>
          <span className="text-xl font-bold text-lime-400">Happy2Live</span>
        </div>
        <button onClick={onGetStarted} className="bg-lime-400 text-black font-bold px-5 py-2 rounded-full hover:bg-lime-300 transition">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <div className="text-center px-4 pt-20 pb-16">
        <div className="text-6xl mb-6 flex items-center justify-center gap-2">
          🙌 <span className="text-red-400">❤️</span> 📈
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-4">
          <span className="text-lime-400">Happy</span>2Live
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Your all-in-one health & wellness companion. Track your body, connect with loved ones, eat better, and live happier.
        </p>
        <button onClick={onGetStarted} className="bg-lime-400 text-black font-black text-lg px-10 py-4 rounded-full hover:bg-lime-300 transition shadow-lg shadow-lime-400/20">
          Start Your Journey →
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-8 pb-20">
        {[
          { icon: "🫀", title: "Health Tracking", desc: "BMI, heart rate, steps, oxygen & more" },
          { icon: "🧬", title: "Body Analysis", desc: "Interactive 3D body — click any area for insights" },
          { icon: "🥗", title: "Meal Planner", desc: "Personalized recipes based on your food preferences" },
          { icon: "👨‍👩‍👧", title: "Family Connect", desc: "Share health goals with friends & family" },
          { icon: "🎙️", title: "Podcasts", desc: "Connect Spotify & Apple Podcasts for health content" },
          { icon: "💪", title: "Motivation", desc: "Daily tips & motivation for all ages" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:border-lime-400/50 transition">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-white mb-1">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
