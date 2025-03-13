import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AdminProducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [navigate, user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Không thể tải danh sách sản phẩm");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Xóa sản phẩm thành công!");
          fetchProducts();
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm");
      }
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleAdd = () => {
    navigate("/admin/products/add");
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="admin-products-page">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <div className="admin-avatar">👤</div>
          <div className="admin-info">
            <h3>{user?.fullName}</h3>
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
        <div className="admin-header">
          <h1>Quản lý sản phẩm</h1>
          <button className="add-product-btn" onClick={handleAdd}>
            Thêm sản phẩm mới
          </button>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Giảm giá</th>
                <th>Thương hiệu</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString()}đ</td>
                  <td>{product.discount}%</td>
                  <td>{product.brand}</td>
                  <td>{product.stock}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product.product_id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product.product_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
