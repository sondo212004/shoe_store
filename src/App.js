import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header/Header";
import Main from "./component/Main/Main";
import Login from "./component/login-signup/login";
import Footer from "./component/Footer/footer";
import Signup from "./component/login-signup/signup";
import ShoesDetail from "./component/ShoesDetail/ShoesDetail";
import AdminDashboard from "./component/Admin/AdminDashboard";
import AdminProducts from "./component/Admin/AdminProducts";
import AdminEditProduct from "./component/Admin/AdminEditProduct";
import AdminAddProduct from "./component/Admin/AdminAddProduct";
import UserProfile from "./component/Users/UserProfile";
import Cart from "./component/Cart/Cart";
import { CartProvider } from "./component/Cart/CartContex";
import Orders from "./component/Order/Orders";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Main />
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/product/:id" element={<ShoesDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route
              path="/admin/products/edit/:id"
              element={<AdminEditProduct />}
            />
            <Route path="/admin/products/add" element={<AdminAddProduct />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
