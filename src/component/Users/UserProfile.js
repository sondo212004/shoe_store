import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";
import Header from "../Header/Header";
import Footer from "../Footer/footer";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const userData = response.data.data;
          setUser(userData);
          setFormData({
            username: userData.username,
            email: userData.email,
            fullName: userData.fullName,
            phone: userData.phone || "",
            address: userData.address || "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setUser(response.data.data);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin"
      );
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <div>Không tìm thấy thông tin người dùng</div>;

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Thông Tin Tài Khoản</h2>
            {!isEditing && (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Tên đăng nhập:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      username: user.username,
                      email: user.email,
                      fullName: user.fullName,
                      phone: user.phone,
                      address: user.address,
                    });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <label>Tên đăng nhập:</label>
                <p>{user.username}</p>
              </div>

              <div className="info-group">
                <label>Họ và tên:</label>
                <p>{user.fullName}</p>
              </div>

              <div className="info-group">
                <label>Email:</label>
                <p>{user.email}</p>
              </div>

              <div className="info-group">
                <label>Số điện thoại:</label>
                <p>{user.phone}</p>
              </div>

              <div className="info-group">
                <label>Địa chỉ:</label>
                <p>{user.address}</p>
              </div>

              <div className="info-group">
                <label>Vai trò:</label>
                <p>{user.role === "admin" ? "Quản trị viên" : "Khách hàng"}</p>
              </div>

              <div className="info-group">
                <label>Ngày tạo tài khoản:</label>
                <p>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
