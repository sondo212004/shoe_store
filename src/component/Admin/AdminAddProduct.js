import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminProducts.css";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    image_url: "",
    discount: 0,
    stock: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Thêm sản phẩm thành công!");
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi thêm sản phẩm");
    }
  };

  return (
    <div className="admin-add-product">
      <div className="admin-header">
        <h2>Thêm Sản Phẩm Mới</h2>
      </div>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Giá:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Thương hiệu:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL Hình ảnh:</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Giảm giá (%):</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Số lượng trong kho:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Thêm sản phẩm
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
