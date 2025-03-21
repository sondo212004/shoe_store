const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Lấy thông tin user
router.get("/profile", verifyToken, userController.getUserProfile);

// Cập nhật thông tin user
router.put("/profile", verifyToken, userController.updateUserProfile);

// Đổi mật khẩu
router.put("/change-password", verifyToken, userController.changePassword);

module.exports = router;
