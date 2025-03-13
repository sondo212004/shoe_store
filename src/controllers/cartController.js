const getCart = async (req, res) => {
  try {
    // TODO: Lấy giỏ hàng của user từ database dựa vào req.user.id
    res.json({ message: "Lấy giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // TODO: Thêm sản phẩm vào giỏ hàng trong database
    res.json({ message: "Thêm vào giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    // TODO: Cập nhật số lượng sản phẩm trong giỏ hàng
    res.json({ message: "Cập nhật giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    // TODO: Xóa sản phẩm khỏi giỏ hàng
    res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
