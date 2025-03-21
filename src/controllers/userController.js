const db = require("../config/db");
const bcrypt = require("bcryptjs");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [user] = await db.query(
      "SELECT user_id, username, email, full_name, phone, address FROM users WHERE user_id = ?",
      [userId]
    );

    if (!user[0]) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    res.json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng",
      error: error.message,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { full_name, phone, address } = req.body;

    await db.query(
      "UPDATE users SET full_name = ?, phone = ?, address = ? WHERE user_id = ?",
      [full_name, phone, address, userId]
    );

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin user:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật thông tin",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    // Lấy mật khẩu hiện tại
    const [user] = await db.query(
      "SELECT password FROM users WHERE user_id = ?",
      [userId]
    );

    // Kiểm tra mật khẩu hiện tại
    const isValid = await bcrypt.compare(currentPassword, user[0].password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await db.query("UPDATE users SET password = ? WHERE user_id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đổi mật khẩu",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
