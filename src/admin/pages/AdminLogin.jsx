import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);

    // 🔐 SIMPLE ADMIN LOGIN (you can later connect backend)
    if (formData.username === "admin" && formData.password === "admin123") {
      localStorage.setItem("adminAuth", "true");

      // small delay for smooth UX
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 300);
    } else {
      alert("Invalid admin credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ea] flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-[420px] bg-white border border-[#e7dcc3] rounded-2xl shadow-sm p-8"
      >
        <h1 className="text-3xl font-bold text-center text-[#b48a2c] mb-2">
          Admin Login
        </h1>

        <p className="text-center text-[#2f4f2f] mb-8">
          Magical Herbal Care
        </p>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none text-[#2f4f2f]"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none text-[#2f4f2f]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2f5d3a] text-white rounded-xl py-3 font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-xs text-[#666] mt-6">
          Use: <b>admin / admin123</b>
        </p>
      </form>
    </div>
  );
}