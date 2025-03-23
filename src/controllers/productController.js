const db = require("../config/db"); // Import kết nối DB
const fs = require("fs");
const path = require("path");

const getAllProducts = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm
    const [products] = await db.query(
      "SELECT product_id, name, description, price, image FROM products"
    );

    // Log thông tin sản phẩm
    console.log("Sản phẩm từ DB:", {
      totalProducts: products.length,
      sampleProduct: products[0],
    });

    // Kiểm tra file ảnh
    products.forEach((product) => {
      if (product.image) {
        const imagePath = path.join(__dirname, "..", "uploads", product.image);
        console.log(`Kiểm tra ảnh ${product.name}:`, {
          imagePath,
          exists: fs.existsSync(imagePath),
        });
      }
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Getting product details for ID:", id);

    // Lấy thông tin sản phẩm
    const [product] = await db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [id]
    );

    console.log("Product data from DB:", product[0]);

    if (!product[0]) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Lấy variants của sản phẩm
    const [variants] = await db.query(
      "SELECT variant_id, product_id, size, color, stock FROM productvariants WHERE product_id = ?",
      [id]
    );

    console.log("Variants from DB:", variants);

    // Kiểm tra nếu không có variants
    if (!variants || variants.length === 0) {
      console.log("No variants found for product:", id);
      return res.status(400).json({
        success: false,
        message: "Sản phẩm không có biến thể",
      });
    }

    const productData = {
      ...product[0],
      variants,
    };

    console.log("Final product data:", {
      productId: id,
      variantsCount: variants.length,
      firstVariant: variants[0],
    });

    res.json({
      success: true,
      data: productData,
    });
  } catch (error) {
    console.error("Error getting product details:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết sản phẩm",
      error: error.message,
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
