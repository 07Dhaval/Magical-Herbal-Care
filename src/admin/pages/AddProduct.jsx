import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, UploadCloud } from "lucide-react";

const LOCAL_API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://magical-herbal-care.onrender.com";

const RENDER_API =
  import.meta.env.VITE_RENDER_API_BASE_URL ||
  "https://magical-herbal-care.onrender.com";

const API_BASE_URL = (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? LOCAL_API
    : RENDER_API
).replace(/\/$/, "");

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? value.replace(/[^\d.]/g, "") : value,
    }));
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select only image file");
      return;
    }

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);

    if (previewImages[index]) {
      URL.revokeObjectURL(previewImages[index]);
    }

    const updatedPreviews = [...previewImages];
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviewImages(updatedPreviews);
  };

  const cleanLines = (value) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.category.trim() || !form.price) {
      alert("Please fill product name, category and price");
      return;
    }

    const selectedImages = images.filter(Boolean);

    if (selectedImages.length === 0) {
      alert("Please select at least one product image");
      return;
    }

    try {
      setLoading(true);

      const description = {
        intro: form.intro.trim(),
        ingredients: form.ingredients
          ? cleanLines(form.ingredients)
          : [],
        process: form.process.trim(),
        benefits: form.benefits
          ? cleanLines(form.benefits)
          : [],
        note: form.note.trim(),
        suitable: form.suitable.trim(),
      };

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("category", form.category.trim());
      formData.append("price", Number(form.price));
      formData.append(
        "description",
        JSON.stringify(description)
      );

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch(
        `${API_BASE_URL}/api/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      // FIXED RESPONSE HANDLING
      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error(
          "Backend returned HTML response:",
          text
        );
        throw new Error(
          "Server error. Please check Render logs."
        );
      }

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to add product"
        );
      }

      alert("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);
      alert(
        error.message || "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[#2f4f2f] mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e7dcc3] rounded-2xl p-6 space-y-4 max-w-5xl shadow-sm"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="input"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="input"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="text"
          className="input"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <label
              key={index}
              className="cursor-pointer border-2 border-dashed border-[#b48a2c]/50 bg-[#fffdf8] rounded-2xl p-4 h-[190px] flex flex-col items-center justify-center text-center"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(
                    index,
                    e.target.files[0]
                  )
                }
                className="hidden"
              />

              {previewImages[index] ? (
                <img
                  src={previewImages[index]}
                  alt=""
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <>
                  <UploadCloud size={24} />
                  <p className="mt-2">
                    Upload Image {index + 1}
                  </p>
                </>
              )}
            </label>
          ))}
        </div>

        <textarea
          name="intro"
          value={form.intro}
          onChange={handleChange}
          placeholder="Intro Description"
          className="input min-h-[90px]"
        />

        <textarea
          name="ingredients"
          value={form.ingredients}
          onChange={handleChange}
          placeholder="Ingredients"
          className="input min-h-[120px]"
        />

        <textarea
          name="process"
          value={form.process}
          onChange={handleChange}
          placeholder="Process"
          className="input min-h-[90px]"
        />

        <textarea
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          placeholder="Benefits"
          className="input min-h-[120px]"
        />

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Note"
          className="input min-h-[80px]"
        />

        <input
          name="suitable"
          value={form.suitable}
          onChange={handleChange}
          placeholder="Suitable For"
          className="input"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2f4f2f] text-white px-8 py-3 rounded-xl flex items-center gap-2"
        >
          <ImagePlus size={18} />
          {loading ? "Saving..." : "Save Product"}
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
      `}</style>
    </div>
  );
}