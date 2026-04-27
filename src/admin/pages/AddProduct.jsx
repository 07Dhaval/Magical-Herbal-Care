import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, UploadCloud } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    intro: "",
    ingredients: "",
    process: "",
    benefits: "",
    note: "",
    suitable: "",
  });

  const [images, setImages] = useState([null, null, null]);
  const [previewImages, setPreviewImages] = useState(["", "", ""]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);

    const updatedPreviews = [...previewImages];
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedImages = images.filter(Boolean);

    if (selectedImages.length === 0) {
      alert("Please select at least one product image");
      return;
    }

    const description = {
      intro: form.intro,
      ingredients: form.ingredients ? form.ingredients.split("\n").filter(Boolean) : [],
      process: form.process,
      benefits: form.benefits ? form.benefits.split("\n").filter(Boolean) : [],
      note: form.note,
      suitable: form.suitable,
    };

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", JSON.stringify(description));

    images.forEach((image) => {
      if (image) formData.append("images", image);
    });

    const res = await fetch(`${API_BASE_URL}/api/products`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("Product added successfully");
      navigate("/admin/products");
    } else {
      alert(data.message || "Failed to add product");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#2f4f2f] mb-6">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e7dcc3] rounded-2xl p-6 space-y-4 max-w-5xl shadow-sm"
      >
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="input" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="input" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <label
              key={index}
              className="cursor-pointer border-2 border-dashed border-[#b48a2c]/50 bg-[#fffdf8] rounded-2xl p-4 h-[190px] flex flex-col items-center justify-center text-center hover:bg-[#f8f4ea] transition"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                className="hidden"
              />

              {previewImages[index] ? (
                <img
                  src={previewImages[index]}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#2f4f2f] text-white flex items-center justify-center mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <h3 className="text-[#2f4f2f] font-semibold">
                    Upload Image {index + 1}
                  </h3>
                  <p className="text-[#b48a2c] text-sm mt-1">
                    PNG, JPG, WEBP
                  </p>
                </>
              )}
            </label>
          ))}
        </div>

        <textarea name="intro" value={form.intro} onChange={handleChange} placeholder="Intro Description" className="input min-h-[90px]" />
        <textarea name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients - one per line" className="input min-h-[120px]" />
        <textarea name="process" value={form.process} onChange={handleChange} placeholder="Process" className="input min-h-[90px]" />
        <textarea name="benefits" value={form.benefits} onChange={handleChange} placeholder="Benefits - one per line" className="input min-h-[120px]" />
        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Note" className="input min-h-[80px]" />
        <input name="suitable" value={form.suitable} onChange={handleChange} placeholder="Suitable For" className="input" />

        <button className="bg-[#2f4f2f] text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-[#b48a2c] transition">
          <ImagePlus size={18} />
          Save Product
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e7dcc3;
          border-radius: 12px;
          padding: 14px 16px;
          outline: none;
          color: #2f4f2f;
          background: #fffdf8;
        }

        .input:focus {
          border-color: #b48a2c;
          box-shadow: 0 0 0 3px rgba(180, 138, 44, 0.15);
        }
      `}</style>
    </AdminLayout>
  );
}