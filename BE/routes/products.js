const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const router = express.Router();

// הגדרת multer להעלאת תמונות
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpe?g|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"));
  },
});

// שליפת כל המוצרים
router.get("/", (req, res) => {
  db.query(
    `SELECT p.id, p.name, p.description, p.price, p.units_in_stock, 
     p.image, p.Tag as tag, c.id as category_id, c.name as category_name 
     FROM products p 
     JOIN categories c ON p.category_id = c.id`,
    (err, products) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(products);
    }
  );
});

// שליפת מוצר לפי ID
router.get("/:id", (req, res) => {
  db.query(
    `SELECT p.id, p.name, p.description, p.price, p.units_in_stock, 
     p.image, p.Tag as tag, c.id as category_id, c.name as category_name 
     FROM products p 
     JOIN categories c ON p.category_id = c.id 
     WHERE p.id = ?`,
    [req.params.id],
    (err, product) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!product || product.length === 0)
        return res.status(404).json({ error: "Product not found" });
      res.json(product[0]);
    }
  );
});

// שליפת מוצרים לפי קטגוריה
router.get("/category/:tag", (req, res) => {
  db.query(
    `SELECT p.id, p.name, p.description, p.price, p.units_in_stock, 
     p.image, p.Tag as tag, c.id as category_id, c.name as category_name 
     FROM products p 
     JOIN categories c ON p.category_id = c.id 
     WHERE c.name = ?`,
    [req.params.tag],
    (err, products) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(products);
    }
  );
});

// שליפת כל הקטגוריות
router.get("/categories/all", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY name", (err, categories) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(categories);
  });
});

// הוספת מוצר חדש עם תמונה
router.post("/", upload.single("image"), (req, res) => {
  const { name, description, price, stock, category } = req.body;
  let imagePath = req.file ? req.file.filename : null;

  if (!name || !price || !category) {
    // מחיקת התמונה אם כבר נשמרה
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res
      .status(400)
      .json({ error: "Name, price, and category are required" });
  }

  db.query(
    "SELECT id FROM categories WHERE name = ?",
    [category],
    (err, categoryResult) => {
      if (err) return res.status(500).json({ error: "Database error" });

      let categoryId;
      if (categoryResult.length > 0) {
        categoryId = categoryResult[0].id;
        insertProduct();
      } else {
        db.query(
          "INSERT INTO categories (name) VALUES (?)",
          [category],
          (err2, newCategory) => {
            if (err2) return res.status(500).json({ error: "Database error" });
            categoryId = newCategory.insertId;
            insertProduct();
          }
        );
      }

      function insertProduct() {
        db.query(
          "INSERT INTO products (name, description, price, units_in_stock, Tag, category_id, supplier_id, image) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
          [
            name,
            description || "",
            price,
            stock || 0,
            category,
            categoryId,
            imagePath,
          ],
          (err3, result) => {
            if (err3) {
              if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
              }
              return res.status(500).json({ error: "Database error" });
            }
            db.query(
              "SELECT * FROM products WHERE id = ?",
              [result.insertId],
              (err4, newProduct) => {
                if (err4)
                  return res.status(500).json({ error: "Database error" });
                res.status(201).json(newProduct[0]);
              }
            );
          }
        );
      }
    }
  );
});

// עדכון מוצר (כולל אפשרות לעדכן תמונה)
router.put("/:id", upload.single("image"), (req, res) => {
  const productId = req.params.id;
  const { name, description, price, stock, category } = req.body;

  if (!name || !price || !category) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res
      .status(400)
      .json({ error: "Name, price, and category are required" });
  }

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, existingProduct) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (existingProduct.length === 0) {
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: "Product not found" });
      }

      db.query(
        "SELECT id FROM categories WHERE name = ?",
        [category],
        (err2, categoryResult) => {
          if (err2) return res.status(500).json({ error: "Database error" });

          let categoryId;
          if (categoryResult.length > 0) {
            categoryId = categoryResult[0].id;
            updateProduct();
          } else {
            db.query(
              "INSERT INTO categories (name) VALUES (?)",
              [category],
              (err3, newCategory) => {
                if (err3)
                  return res.status(500).json({ error: "Database error" });
                categoryId = newCategory.insertId;
                updateProduct();
              }
            );
          }

          function updateProduct() {
            let updateQuery =
              "UPDATE products SET name = ?, description = ?, price = ?, units_in_stock = ?, Tag = ?, category_id = ?";
            let params = [
              name,
              description || "",
              price,
              stock || 0,
              category,
              categoryId,
            ];

            // טיפול בתמונה חדשה אם קיימת
            if (req.file) {
              // מוחק את התמונה הקודמת אם הייתה
              if (existingProduct[0].image) {
                const oldImagePath = path.join(
                  __dirname,
                  "../images",
                  existingProduct[0].image
                );
                if (fs.existsSync(oldImagePath)) {
                  fs.unlinkSync(oldImagePath);
                }
              }
              updateQuery += ", image = ?";
              params.push(req.file.filename);
            }

            updateQuery += " WHERE id = ?";
            params.push(productId);

            db.query(updateQuery, params, (err4, result) => {
              if (err4) {
                if (req.file && fs.existsSync(req.file.path)) {
                  fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({ error: "Database error" });
              }
              db.query(
                "SELECT * FROM products WHERE id = ?",
                [productId],
                (err5, updatedProduct) => {
                  if (err5)
                    return res.status(500).json({ error: "Database error" });
                  res.json(updatedProduct[0]);
                }
              );
            });
          }
        }
      );
    }
  );
});

// מחיקת מוצר (כולל מחיקת תמונה)
router.delete("/:id", (req, res) => {
  const productId = req.params.id;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, product) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (product.length === 0)
        return res.status(404).json({ error: "Product not found" });

      db.query(
        "DELETE FROM products WHERE id = ?",
        [productId],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: "Database error" });

          // מוחק את קובץ התמונה אם קיים
          if (product[0].image) {
            const imagePath = path.join(
              __dirname,
              "../images",
              product[0].image
            );
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }

          res.json({ message: "Product deleted successfully" });
        }
      );
    }
  );
});

module.exports = router;
