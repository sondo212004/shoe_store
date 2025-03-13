import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Main.css";
import ShoesDetail from "../ShoesDetail/ShoesDetail";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/");
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err) {
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-container row">
      {/* Sidebar */}
      <div className="sidebar col-md-3">
        <h2 className="sidebar-title">DANH MỤC SẢN PHẨM</h2>
        <ul className="category-list">
          <li>
            <img src="adidas-logo.png" alt="Adidas" className="brand-icon" />
            <Link to="#">Giày Adidas cao cấp</Link>
          </li>
          <li>
            <img src="nike-logo.png" alt="Nike" className="brand-icon" />
            <Link to="#">Giày Nike cao cấp</Link>
          </li>
          <li>
            <img
              src="balenciaga-logo.png"
              alt="Balenciaga"
              className="brand-icon"
            />
            <Link to="#">Giày Balenciaga</Link>
          </li>
          <li>
            <img
              src="newbalance-logo.png"
              alt="New Balance"
              className="brand-icon"
            />
            <Link to="#">Giày New Balance</Link>
          </li>
          <li>
            <img
              src="converse-logo.png"
              alt="Converse"
              className="brand-icon"
            />
            <Link to="#">Giày Converse</Link>
          </li>
          <li>
            <img src="puma-logo.png" alt="Puma" className="brand-icon" />
            <Link to="#">Giày Puma</Link>
          </li>
          <li>
            <img src="vans-logo.png" alt="Vans" className="brand-icon" />
            <Link to="#">Giày VanS</Link>
          </li>
          <li>
            <img src="asics-logo.png" alt="Asics" className="brand-icon" />
            <Link to="#">Giày Asics</Link>
          </li>
          <li>
            <img src="reebok-logo.png" alt="Reebok" className="brand-icon" />
            <Link to="#">Giày Reebok</Link>
          </li>
        </ul>
      </div>

      <div className="banner-section col-md-9">
        <img
          src="/sneaker-that-has-word-nike-it.jpg"
          alt="Nike Sneaker Banner"
          className="banner-image"
        />

        <div className="banner-overlay">
          <h1>Discover Your Perfect Sneakers</h1>
          <p>Explore our collection of premium sneakers</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Best Sellers Section */}

        <div className="best-sellers">
          <div className="section-header">
            <h2>SẢN PHẨM BÁN CHẠY</h2>
            {/* <Link to="/products" className="view-all">
              Xem thêm
            </Link> */}
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="product-link"
              >
                <div className="product-card">
                  <div className="product-image">
                    <img src={product.image_url} alt={product.name} />
                    {product.discount > 0 && (
                      <span className="discount-badge">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">
                      {product.discount > 0 ? (
                        <>
                          <span className="original-price">
                            {product.price.toLocaleString()}đ
                          </span>
                          <span className="discounted-price">
                            {(
                              product.price *
                              (1 - product.discount / 100)
                            ).toLocaleString()}
                            đ
                          </span>
                        </>
                      ) : (
                        <span className="price">
                          {product.price.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.preventDefault(); // Ngăn chặn việc chuyển trang khi click vào nút
                        // Xử lý thêm vào giỏ hàng ở đây
                      }}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
