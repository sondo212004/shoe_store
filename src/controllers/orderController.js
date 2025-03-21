const db = require("../config/db"); // Import kết nối DB

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    console.log("Fetching orders for user:", userId);

    // Lấy danh sách đơn hàng
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    console.log("Found orders:", orders);

    // Lấy chi tiết cho từng đơn hàng
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [details] = await db.query(
          `SELECT 
            od.*,
            p.name,
            p.image as product_image,
            v.size,
            v.color
           FROM order_details od
           JOIN productvariants v ON od.variant_id = v.variant_id
           JOIN products p ON v.product_id = p.product_id
           WHERE od.order_id = ?`,
          [order.order_id]
        );

        // Xử lý đường dẫn ảnh cho mỗi sản phẩm
        const detailsWithImages = details.map((detail) => ({
          ...detail,
          image_url: detail.product_image
            ? `/uploads/${detail.product_image}`
            : null,
        }));

        console.log("Order details:", detailsWithImages);

        return {
          ...order,
          details: detailsWithImages,
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithDetails,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.id;
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
