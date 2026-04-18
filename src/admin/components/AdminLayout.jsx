import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f6f3eb]">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}