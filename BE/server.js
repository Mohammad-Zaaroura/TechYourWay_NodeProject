const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// ייבוא רוטרים (רק users צריך את bcrypt)
const usersRouter = require("./routes/users")(bcrypt);
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const contactRouter = require("./routes/contact");

const app = express();

app.use(cors());
app.use(express.json());

// יצירת תיקיית תמונות אם לא קיימת
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log("Created images directory at:", imagesDir);
}

// שרת קבצים סטטיים
app.use(
  "/images",
  express.static(imagesDir, {
    setHeaders: (res, path) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/contact", contactRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Serving static files from:", imagesDir);
});
