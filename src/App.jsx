import { useState } from "react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem("h2l_user");
    return saved ? "dashboard" : "landing";
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("h2l_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem("h2l_user", JSON.stringify(userData));
    setUser(userData);
    setPage("dashboard");
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem("h2l_user", JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem("h2l_user");
    setUser(null);
    setPage("landing");
  };

  if (page === "landing") return <Landing onGetStarted={() => setPage("auth")} />;
  if (page === "auth") return <Auth onLogin={login} onBack={() => setPage("landing")} />;
  if (page === "dashboard") return <Dashboard user={user} onLogout={logout} onUpdateUser={updateUser} />;
}
