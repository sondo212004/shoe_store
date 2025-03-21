const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const orderController = require("../controllers/orderController");

// Route lấy đơn hàng của user
router.get("/my-orders", verifyToken, async (req, res) => {
  console.log("Nhận request GET /my-orders");
  try {
    await orderController.getMyOrders(req, res);
  } catch (error) {
    console.error("Lỗi xử lý route /my-orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xử lý yêu cầu",
      error: error.message,
    });
  }
});

// Route tạo đơn hàng mới
router.post("/", verifyToken, async (req, res) => {
  console.log("Nhận request POST /");
  try {
    await orderController.createOrder(req, res);
  } catch (error) {
    console.error("Lỗi xử lý route tạo đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng",
      error: error.message,
    });
  }
});

// Admin: Lấy tất cả đơn hàng
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    // TODO: Thêm logic lấy tất cả đơn hàng
    res.json({ message: "Lấy tất cả đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Admin: Cập nhật trạng thái đơn hàng
router.put("/status/:orderId", verifyToken, isAdmin, async (req, res) => {
  try {
    // TODO: Thêm logic cập nhật trạng thái đơn hàng
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
