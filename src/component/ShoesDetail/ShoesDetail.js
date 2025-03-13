import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";
import "./ShoesDetail.css";
import Header from "../Header/Header";
import Footer from "../Footer/footer";

const ShoesDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        if (response.data.success) {
          setProduct(response.data.data);
          // Nếu có variants, chọn variant đầu tiên làm mặc định
          if (
            response.data.data.variants &&
            response.data.data.variants.length > 0
          ) {
            setSelectedVariant(response.data.data.variants[0]);
          }
        }
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Lọc danh sách màu sắc duy nhất từ variants
  const uniqueColors = product?.variants
    ? [...new Set(product.variants.map((v) => v.color))]
    : [];

  // Lọc danh sách size dựa trên màu đã chọn
  const availableSizes = product?.variants
    ? product.variants.filter((v) => v.color === selectedColor)
    : [];

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size khi đổi màu
    setSelectedVariant(null); // Reset variant khi đổi màu
  };

  const handleSizeSelect = (variant) => {
    setSelectedVariant(variant);
    setSelectedSize(variant.size);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && selectedVariant && value <= selectedVariant.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn size và màu sắc");
      return;
    }
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", {
      product,
      variant: selectedVariant,
      quantity,
    });
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>;

  return (
    <>
      <Header />
      <div className="shoes-detail-container">
        <div className="product-detail">
          <div className="product-images">
            <div className="main-image">
              <img src={product.image_url} alt={product.name} />
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-detail">
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
                  <span className="discount-tag">-{product.discount}%</span>
                </>
              ) : (
                <span className="price">{product.price.toLocaleString()}đ</span>
              )}
            </div>

            <div className="product-description">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>

            <div className="color-selector">
              <h3>Màu sắc</h3>
              <div className="color-options border border-0">
                {uniqueColors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-btn ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {selectedColor && (
              <div className="size-selector">
                <h3>Chọn size</h3>
                <div className="size-options">
                  {availableSizes.map((variant) => (
                    <button
                      key={variant.variant_id}
                      className={`size-btn ${
                        selectedVariant?.variant_id === variant.variant_id
                          ? "selected"
                          : ""
                      } ${variant.stock === 0 ? "out-of-stock" : ""}`}
                      onClick={() => handleSizeSelect(variant)}
                      disabled={variant.stock === 0}
                    >
                      {variant.size}
                      {variant.stock === 0 && (
                        <span className="out-of-stock-label">Hết hàng</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Số lượng:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="quantity-btn"
                    disabled={!selectedVariant}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={selectedVariant?.stock || 1}
                    disabled={!selectedVariant}
                  />
                  <button
                    onClick={() =>
                      selectedVariant &&
                      quantity < selectedVariant.stock &&
                      setQuantity(quantity + 1)
                    }
                    className="quantity-btn"
                    disabled={!selectedVariant}
                  >
                    +
                  </button>
                </div>
                {selectedVariant && (
                  <span className="stock-info">
                    Còn {selectedVariant.stock} sản phẩm
                  </span>
                )}
              </div>

              <button
                className="add-to-cart"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <FiShoppingCart className="cart-icon" />
                {selectedVariant?.stock === 0
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoesDetail;
