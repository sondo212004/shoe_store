const db = require("../config/db"); // Import kết nối DB

const getAllProducts = async (req, res) => {
  try {
    console.log("Đang lấy sản phẩm...");
    const [products] = await db.query("SELECT * FROM products");
    // console.log("Sản phẩm:", products); // Kiểm tra data trả về
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message, // Thêm chi tiết lỗi
    });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    // Lấy thông tin sản phẩm cơ bản
    const [product] = await db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [req.params.id]
    );

    if (!product.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Lấy thông tin variants của sản phẩm
    const [variants] = await db.query(
      "SELECT * FROM productvariants WHERE product_id = ?",
      [req.params.id]
    );

    res.json({
      success: true,
      data: {
        ...product[0],
        variants: variants,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm",
    });
  }
};

// Thêm sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, brand, stock, image } =
      req.body;

    if (!name || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin sản phẩm",
      });
    }

    const [result] = await db.query(
      "INSERT INTO products (name, description, price, category_id, brand, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, category_id, brand, stock, image]
    );

    res.status(201).json({
      success: true,
      message: "Sản phẩm đã được thêm",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm sản phẩm",
    });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(updates);

    const [result] = await db.query(
      `UPDATE products SET ${fields} WHERE product_id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({ success: true, message: "Sản phẩm đã được cập nhật" });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
    });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM products WHERE product_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
    });
  }
};

// Tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: "Thiếu từ khóa tìm kiếm",
      });
    }

    const searchPattern = `%${searchQuery}%`;
    const [products] = await db.query(
      "SELECT * FROM products WHERE name LIKE ? OR brand LIKE ? OR description LIKE ?",
      [searchPattern, searchPattern, searchPattern]
    );

    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm sản phẩm",
    });
  }
};

// Export các hàm
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
