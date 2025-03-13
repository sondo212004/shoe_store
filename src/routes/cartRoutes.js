const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

// Lấy giỏ hàng của user
router.get("/", verifyToken, getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", verifyToken, addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update/:productId", verifyToken, updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove/:productId", verifyToken, removeFromCart);

module.exports = router;
