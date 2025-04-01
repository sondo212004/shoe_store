import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    stock: "",
    discount: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchProduct();
  }, [id, navigate, user]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching product with token:",
        token?.substring(0, 20) + "..."
      );

      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Product data response:", response.data);

      const productData = response.data.data;
      setProduct(productData);
      setFormData({
        name: productData.name || "",
        price: productData.price || 0,
        description: productData.description || "",
        brand: productData.brand || "",
        stock: productData.stock || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(
        error.response?.data?.message || "Không thể tải thông tin sản phẩm"
      );
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to:`, value); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Current form data:", formData);

      // Convert string values to appropriate types
      const updatedData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        stock: parseInt(formData.stock),
      };

      console.log("Sending update request with data:", updatedData);

      const response = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/admin/products");
      }
    } catch (error) {
      console.error("Error updating product:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật sản phẩm"
      );
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-products-page">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <div className="admin-avatar">👤</div>
          <div className="admin-info">
            <h3>{user?.full_name}</h3>
            <p>Admin</p>
          </div>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="nav-item">
            Dashboard
          </Link>
          <Link to="/admin/products" className="nav-item active">
            Sản phẩm
          </Link>
          <Link to="/admin/orders" className="nav-item">
            Đơn hàng
          </Link>
          <Link to="/admin/users" className="nav-item">
            Người dùng
          </Link>
        </nav>
      </div>

      <div className="admin-content">
        <div className="edit-product-container">
          <div className="edit-product-header">
            <h2>Chỉnh sửa sản phẩm #{id}</h2>
            <Link to="/admin/products" className="back-button">
              Quay lại
            </Link>
          </div>

          <div className="product-preview">
            <img
              src={product?.image}
              alt={product?.name}
              className="product-image"
              onError={(e) => {
                e.target.src = "http://localhost:5000/images/placeholder.jpg";
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="edit-product-form">
            <div className="form-group">
              <label>Tên sản phẩm:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Giữ nguyên tên hiện tại"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giá:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Giữ nguyên giá hiện tại"
                />
              </div>

              <div className="form-group">
                <label>Giảm giá (%):</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="Giữ nguyên % giảm giá"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Giữ nguyên mô tả hiện tại"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thương hiệu:</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Giữ nguyên thương hiệu hiện tại"
                />
              </div>

              <div className="form-group">
                <label>Tồn kho:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Giữ nguyên số lượng hiện tại"
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Lưu thay đổi
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/admin/products")}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
