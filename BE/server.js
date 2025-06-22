const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tech_your_way",
});

const usersRouter = require("./routes/users")(db, bcrypt);
const productsRouter = require("./routes/products")(db);
const cartRouter = require("./routes/cart")(db);
const ordersRouter = require("./routes/orders")(db);

const app = express();

app.use(cors());
app.use(express.json()); 

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('Created images directory at:', imagesDir);
}

// Serve static files from the images directory
app.use('/images', express.static(imagesDir, {
    setHeaders: (res, path) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Serving static files from:', imagesDir);
});