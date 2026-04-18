import AdminLayout from "../components/AdminLayout";
import ordersData from "../data/ordersData";

export default function Dashboard() {
  const totalOrders = ordersData.length;
  const pendingOrders = ordersData.filter((item) => item.status === "Pending").length;
  const deliveredOrders = ordersData.filter((item) => item.status === "Delivered").length;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#6b4b1f] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e7dcc3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-[#456b3d] text-lg">Total Orders</h3>
          <p className="text-3xl font-bold text-[#2f5d3a] mt-2">{totalOrders}</p>
        </div>

        <div className="bg-white border border-[#e7dcc3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-[#456b3d] text-lg">Pending Orders</h3>
          <p className="text-3xl font-bold text-[#6b4b1f] mt-2">{pendingOrders}</p>
        </div>

        <div className="bg-white border border-[#e7dcc3] rounded-2xl p-6 shadow-sm">
          <h3 className="text-[#456b3d] text-lg">Delivered Orders</h3>
          <p className="text-3xl font-bold text-[#2f5d3a] mt-2">{deliveredOrders}</p>
        </div>
      </div>
    </AdminLayout>
  );
}