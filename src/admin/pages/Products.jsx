import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export default function Products() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    const data = await res.json();
    if (data.success) setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#2f4f2f]">Products</h1>

        <Link
          to="/admin/products/add"
          className="bg-[#2f4f2f] text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#b48a2c] transition"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white border border-[#e7dcc3] rounded-2xl shadow-sm">
        <table className="w-full min-w-[950px]">
          <thead className="bg-[#f3ead7] text-[#b48a2c]">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-[#e7dcc3]">
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-contain border border-[#e7dcc3] rounded-xl bg-white"
                  />
                </td>

                <td className="p-4 text-[#2f4f2f]">{product.name}</td>
                <td className="p-4 text-[#2f4f2f]">{product.category}</td>

                <td className="p-4 text-[#b48a2c] font-semibold">
                  ₹{product.price}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="bg-[#2f4f2f] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#b48a2c] transition"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-[#2f4f2f]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}