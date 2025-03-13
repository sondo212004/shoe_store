require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const colors = require("colors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
// Dùng routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// connection.query("SELECT 1").then(() => {
//   console.log("MYSQL CONNECTED");
// });

// connection.query("SELECT * FROM users").then((result) => {
//   console.log(result);
// });

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Server đang chạy thành công!");
});
