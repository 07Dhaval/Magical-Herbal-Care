import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ea] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border border-[#e7dcc3]">
        
        <h2 className="text-3xl font-bold text-center text-[#b48a2c] mb-2">
          Admin Login
        </h2>

        <p className="text-center text-[#2f4f2f] mb-6">
          Login to access admin dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none bg-[#fffdf8] text-[#333] focus:border-[#b48a2c] focus:ring-2 focus:ring-[#b48a2c]/20"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#e7dcc3] rounded-xl px-4 py-3 outline-none bg-[#fffdf8] text-[#333] focus:border-[#b48a2c] focus:ring-2 focus:ring-[#b48a2c]/20"
          />

          {error && <p className="text-[#b23a3a] text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#2f4f2f] hover:bg-[#b48a2c] text-white py-3 rounded-xl transition font-medium"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}