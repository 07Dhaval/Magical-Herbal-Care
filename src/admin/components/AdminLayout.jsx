import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const navClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl font-medium transition ${
      isActive ? "bg-[#b48a2c] text-white" : "text-white hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-[#f8f4ea]">
      <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] bg-[#2f5d3a] text-white shadow-lg">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-white/70 mt-1">Magical Herbal Care</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/admin/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={navClass}>
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={navClass}>
            Orders
          </NavLink>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl bg-[#b48a2c] py-3 font-medium text-white hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-[250px] min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}