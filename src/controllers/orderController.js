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
        o.total_price,
        o.status,
        o.created_at,
        od.order_detail_id,
        od.quantity,
        od.price,
        p.name as product_name,
        p.image,
        pv.size,
        pv.color
      FROM orders o
      JOIN orderdetails od ON o.order_id = od.order_id
      JOIN productvariants pv ON od.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;

    console.log("Executing query with user_id:", userId);
    const [orders] = await db.query(query, [userId]);
    console.log("Found orders:", orders);

    // Nhóm các chi tiết đơn hàng theo order_id
    const groupedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find((o) => o.order_id === order.order_id);
      if (existingOrder) {
        existingOrder.details.push({
          order_detail_id: order.orderdetail_id,
          quantity: order.quantity,
          price: order.price,
          name: order.product_name,
          image_url: order.image,
          size: order.size,
          color: order.color,
        });
      } else {
        acc.push({
          order_id: order.order_id,
          total_price: order.total_price,
          status: order.status,
          created_at: order.created_at,
          details: [
            {
              orderdetail_id: order.orderdetail_id,
              quantity: order.quantity,
              price: order.price,
              name: order.product_name,
              image_url: order.image,
              size: order.size,
              color: order.color,
            },
          ],
        });
      }
      return acc;
    }, []);

    res.json({
      success: true,
      data: groupedOrders,
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
        `INSERT INTO orderdetails 
         (order_id, variant_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.variant_id,
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
    const query = `
      SELECT 
        o.order_id,
        o.user_id,
        o.total_price,
        o.status,
        o.created_at,
        od.order_detail_id,
        od.quantity,
        od.price,
        p.name as product_name,
        p.image,
        pv.size,
        pv.color,
        u.email as user_email,
        u.full_name as user_fullname
      FROM orders o
      JOIN orderdetails od ON o.order_id = od.order_id
      JOIN productvariants pv ON od.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.created_at DESC
    `;

    const [orders] = await db.query(query);

    // Nhóm các chi tiết đơn hàng theo order_id
    const groupedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find((o) => o.order_id === order.order_id);
      if (existingOrder) {
        existingOrder.details.push({
          order_detail_id: order.order_detail_id,
          quantity: order.quantity,
          price: order.price,
          name: order.product_name,
          image_url: order.image,
          size: order.size,
          color: order.color,
        });
      } else {
        acc.push({
          order_id: order.order_id,
          user_id: order.user_id,
          user_email: order.user_email,
          user_fullname: order.user_fullname,
          total_price: order.total_price,
          status: order.status,
          created_at: order.created_at,
          details: [
            {
              order_detail_id: order.order_detail_id,
              quantity: order.quantity,
              price: order.price,
              name: order.product_name,
              image_url: order.image,
              size: order.size,
              color: order.color,
            },
          ],
        });
      }
      return acc;
    }, []);

    res.json({
      success: true,
      data: groupedOrders,
    });
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { orderId } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = ["pending", "processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    // Cập nhật trạng thái đơn hàng
    await connection.query(`UPDATE orders SET status = ? WHERE order_id = ?`, [
      status,
      orderId,
    ]);

    await connection.commit();

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: { orderId, status },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getMyOrders,
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
