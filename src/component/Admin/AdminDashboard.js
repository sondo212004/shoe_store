import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Kiểm tra role admin
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [navigate, user]);

  if (loading) return <div className="admin-loading">Đang tải...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <div className="admin-avatar">👤</div>
          <div className="admin-info">
            <h3>{user?.full_name}</h3>
            <p>Admin</p>
          </div>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className="nav-item active text-decoration-none">
            Dashboard
          </Link>
          <Link to="/admin/products" className="nav-item text-decoration-none">
            Sản phẩm
          </Link>
          <Link to="/admin/orders" className="nav-item text-decoration-none">
            Đơn hàng
          </Link>
          <Link to="/admin/users" className="nav-item text-decoration-none">
            Người dùng
          </Link>
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Đăng xuất
          </button>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Tổng sản phẩm</h3>
            <p>{products.length}</p>
          </div>
          <div className="stat-card">
            <h3>Đơn hàng mới</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <h3>Doanh thu</h3>
            <p>0đ</p>
          </div>
        </div>

        <div className="admin-products">
          <div className="section-header">
            <h2>Quản lý sản phẩm</h2>
          </div>

          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Thương hiệu</th>
                <th>Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>
                    <img
                      src={`${product.image}`}
                      alt={product.name}
                      className="product-thumbnail"
                      onError={(e) => {
                        e.target.src =
                          "http://localhost:5000/images/placeholder.jpg";
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString()}đ</td>
                  <td>{product.brand}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
