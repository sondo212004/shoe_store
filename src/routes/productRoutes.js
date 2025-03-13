const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");

// Route lấy danh sách sản phẩm
router.get("/", getAllProducts);

// Route tìm kiếm sản phẩm - Đặt TRƯỚC route có param
router.get("/search", searchProducts);

// Route lấy sản phẩm theo ID - Đặt SAU các route cụ thể
router.get("/:id", getProductById);

// Route thêm sản phẩm mới (chỉ admin)
router.post("/", verifyToken, isAdmin, createProduct);

// Route cập nhật sản phẩm (chỉ admin)
router.put("/:id", verifyToken, isAdmin, updateProduct);

// Route xóa sản phẩm (chỉ admin)
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
