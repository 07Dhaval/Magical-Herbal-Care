import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

const LOCAL_API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const RENDER_API =
  import.meta.env.VITE_RENDER_API_BASE_URL ||
  "https://magical-herbal-care.onrender.com";

const API_BASE_URL = (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API
    : RENDER_API
).replace(/\/$/, "");

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductId = (product) => product?._id || product?.id;

  const getImageUrl = (product) => {
    const image =
      product?.image ||
      product?.images?.[0] ||
      product?.productImage ||
      "";

    if (!image) return "";

    if (image.startsWith("http")) return image;

    if (image.startsWith("/")) {
      return `${API_BASE_URL}${image}`;
    }

    return `${API_BASE_URL}/uploads/products/${image}`;
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "₹0.00";

    const amount =
      typeof price === "number"
        ? price
        : Number(String(price).replace(/[^\d.]/g, ""));

    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
        alert(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
      alert("Backend not connected. Please check server or API URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!id) {
      alert("Product ID missing");
      return;
    }

    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        fetchProducts();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#2f4f2f]">
          Products
        </h1>

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
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-[#2f4f2f]">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-[#2f4f2f]">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const productId = getProductId(product);
                const imageUrl = getImageUrl(product);

                return (
                  <tr
                    key={productId}
                    className="border-t border-[#e7dcc3]"
                  >
                    <td className="p-4">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name || "Product"}
                          className="w-20 h-20 object-contain border border-[#e7dcc3] rounded-xl bg-white"
                        />
                      ) : (
                        <div className="w-20 h-20 border border-[#e7dcc3] rounded-xl bg-[#f8f4ea] flex items-center justify-center text-xs text-[#2f4f2f]">
                          No Image
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-[#2f4f2f] font-medium">
                      {product.name || "Untitled Product"}
                    </td>

                    <td className="p-4 text-[#2f4f2f]">
                      {product.category || "-"}
                    </td>

                    <td className="p-4 text-[#b48a2c] font-semibold">
                      {formatPrice(product.price)}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-3 flex-wrap">
                        <Link
                          to={`/admin/products/edit/${productId}`}
                          className="bg-[#2f4f2f] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#b48a2c] transition"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteProduct(productId)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}