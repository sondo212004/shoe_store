import React from "react";
import { useNavigate } from "react-router-dom";
import "./SearchResult.css";

export const SearchResult = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.product_id}`);
  };

  return (
    <div className="search-result" onClick={handleClick}>
      <div className="search-result-content">
        <img
          src={product.image}
          alt={product.name}
          className="search-result-image"
        />
        <div className="search-result-info">
          <div className="search-result-name">{product.name}</div>
          <div className="search-result-price">
            {product.price.toLocaleString("vi-VN")} đ
          </div>
        </div>
      </div>
    </div>
  );
};
