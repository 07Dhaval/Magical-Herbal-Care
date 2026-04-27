import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-[#2f5d3a] text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <div className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname === item.path
                ? "bg-[#b48a2c]"
                : "hover:bg-white/10"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 w-full bg-[#b48a2c] hover:bg-[#b7a170] px-4 py-3 rounded-xl transition"
      >
        Logout
      </button>
    </aside>
  );
}