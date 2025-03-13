// Header.js
import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "../Users/UserProfile";
const Header = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Đóng user menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userIcon = document.getElementById("userIcon");
      const userMenu = document.getElementById("userMenu");

      if (userIcon && userMenu) {
        if (
          !userIcon.contains(event.target) &&
          !userMenu.contains(event.target)
        ) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="p-2">
      <nav className="navbar">
        {/* Logo and Title */}
        <div className="logo-container d-flex align-items-center">
          <img
            src="Logo_home.png"
            alt="logo"
            style={{ width: "70px", height: "70px" }}
          />
          <h2 style={{ fontWeight: "bold", color: "#7749F8" }}>Sneakers</h2>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for products, categories or brands..."
          />
          <button>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/009/652/218/small_2x/magnifying-glass-icon-isolated-on-white-background-search-illustration-vector.jpg"
              alt="search"
              style={{ width: "25px", height: "25px" }}
            />
          </button>
        </div>

        {/* Navigation Links and Buttons */}
        <div className="nav-links d-flex">
          <a href="/" style={{ textDecoration: "none", color: "black" }}>
            Home
          </a>
          <div className="position-relative">
            <a href="#">
              <img
                src="https://static.vecteezy.com/system/resources/previews/001/504/962/non_2x/shopping-cart-icon-free-vector.jpg"
                alt="cart"
                style={{ width: "25px", height: "25px" }}
              />
              <span className="badge bg-danger">0</span>
            </a>
          </div>

          {/* Conditional rendering based on login state */}
          <div className="auth-section">
            {isLoggedIn ? (
              <div className="user-menu-container">
                <div className="user-icon" onClick={toggleUserMenu}>
                  {user.fullName ? user.fullName[0].toUpperCase() : "👤"}
                </div>
                {showUserMenu && (
                  <div className="user-menu">
                    <div className="user-info">
                      <p className="user-name">{user.fullName}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="menu-divider"></div>
                    <Link to="/user/profile" className="menu-item">
                      Thông tin tài khoản
                    </Link>
                    <Link to="/orders" className="menu-item">
                      Đơn hàng của tôi
                    </Link>
                    <div className="menu-divider"></div>
                    <button onClick={handleLogout} className="menu-item logout">
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/signup">Sign Up</Link>
                <span className="divider">|</span>
                <Link to="/login">Log in</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
