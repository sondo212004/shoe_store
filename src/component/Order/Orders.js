import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";
import Header from "../Header/Header";
import Footer from "../Footer/footer";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Kiểm tra token
    if (!token) {
      setError("Vui lòng đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    // Kiểm tra token có hợp lệ không
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = tokenData.exp * 1000; // Chuyển sang milliseconds

      if (Date.now() >= expirationTime) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        setLoading(false);
        localStorage.removeItem("token");
        return;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra token:", error);
      setError("Token không hợp lệ. Vui lòng đăng nhập lại");
      setLoading(false);
      localStorage.removeItem("token");
      return;
    }

    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      console.log(
        "Đang lấy đơn hàng với token:",
        token?.substring(0, 20) + "..."
      );

      const response = await axios.get(
        "http://localhost:5000/api/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Phản hồi từ API:", {
        trạng_thái: response.status,
        headers: response.headers,
        dữ_liệu: response.data,
      });

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError(response.data.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        localStorage.removeItem("token");
      } else if (error.response?.status === 404) {
        setError(
          "Không tìm thấy API endpoint. Vui lòng kiểm tra lại đường dẫn"
        );
      } else {
        setError(
          "Không thể tải danh sách đơn hàng: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "processing":
        return "#17a2b8";
      case "shipped":
        return "#007bff";
      case "delivered":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      default:
        return "Không xác định";
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="orders-loading">Đang tải đơn hàng...</div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="orders-error">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">
            Thử lại
          </button>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="orders-container">
        <h2>Đơn hàng của tôi</h2>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Bạn chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Đơn hàng #{order.order_id}</span>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="order-details">
                  {order.details.map((item) => (
                    <div key={item.order_detail_id} className="order-item">
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.name}
                        className="item-image"
                        onError={(e) => {
                          console.error("Image load error:", item.image_url);
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>
                          Size: {item.size}, Màu: {item.color}
                        </p>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {item.price.toLocaleString()}đ</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    Tổng tiền: {order.total_price.toLocaleString()}đ
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
