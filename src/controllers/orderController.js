const db = require("../config/db"); // Import kết nối DB

const getMyOrders = async (req, res) => {
  try {
    // Log để debug
    console.log("Request user data:", req.user);
    console.log("Authorization header:", req.headers.authorization);

    if (!req.user || !req.user.user_id) {
      console.log("No user data found in request");
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    const userId = req.user.user_id;
    console.log("Fetching orders for user:", userId);

    const query = `
      SELECT 
        o.order_id,
        o.total_amount,
        o.status,
        o.created_at,
        oi.quantity,
        oi.price,
        p.name as product_name,
        p.image,
        v.size,
        v.color
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      JOIN variants v ON oi.variant_id = v.variant_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;

    console.log("Executing query with user_id:", userId);
    const [orders] = await db.query(query, [userId]);
    console.log("Found orders:", orders);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.user_id;
    const { items, totalAmount } = req.body;

    // Log để debug
    console.log("Creating order:", { userId, items, totalAmount });

    // 1. Tạo đơn hàng mới
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_price, status, created_at) 
       VALUES (?, ?, 'pending', NOW())`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    // 2. Thêm chi tiết đơn hàng
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_details 
         (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price * (1 - (item.discount || 0) / 100),
        ]
      );
    }

    // 3. Xóa giỏ hàng
    await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    await connection.commit();

    res.json({
      success: true,
      message: "Đặt hàng thành công",
      data: { orderId },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng: " + error.message,
    });
  } finally {
    connection.release();
  }
};

const getAllOrders = async (req, res) => {
  try {
    // TODO: Admin lấy tất cả đơn hàng từ database
    res.json({ message: "Lấy tất cả đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    // TODO: Admin cập nhật trạng thái đơn hàng
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getMyOrders,
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
