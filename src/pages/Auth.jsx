import { useState } from "react";

export default function Auth({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handle = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ name: form.email.split("@")[0], email: form.email, age: 25, height: "", weight: "", gender: "" });
    } else {
      onLogin({
        name: form.name,
        email: form.email,
        age: form.age,
        height: form.height,
        weight: form.weight,
        gender: form.gender,
      });
    }
  };

  const inputClass =
    "w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-lime-400 outline-none transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="text-gray-400 mb-6 hover:text-white flex items-center gap-1 transition"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🫶</div>
          <h2 className="text-3xl font-black text-lime-400">Happy2Live</h2>
          <p className="text-gray-400 mt-1">
            {isLogin ? "Welcome back! Sign in to continue." : "Start your health journey today."}
          </p>
        </div>

        <form
          onSubmit={handle}
          className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 space-y-4 backdrop-blur-sm"
        >
          {!isLogin && (
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
              <input
                required
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Alex Johnson"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder={isLogin ? "Your password" : "Create a strong password"}
                className={inputClass + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-lg"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Age</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="120"
                    value={form.age}
                    onChange={set("age")}
                    placeholder="e.g. 28"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Gender</label>
                  <select
                    required
                    value={form.gender}
                    onChange={set("gender")}
                    className={inputClass + " cursor-pointer"}
                  >
                    <option value="" disabled>Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Height (cm)</label>
                  <input
                    required
                    type="number"
                    min="50"
                    max="280"
                    value={form.height}
                    onChange={set("height")}
                    placeholder="e.g. 172"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Weight (kg)</label>
                  <input
                    required
                    type="number"
                    min="10"
                    max="500"
                    value={form.weight}
                    onChange={set("weight")}
                    placeholder="e.g. 70"
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-lime-400 text-black font-black py-3 rounded-xl hover:bg-lime-300 transition text-lg mt-2"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center text-gray-400 text-sm pt-1">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-lime-400 hover:underline font-medium"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          By continuing you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
