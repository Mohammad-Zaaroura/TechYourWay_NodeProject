const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get all products
  router.get("/", async (req, res) => {
    try {
      const [products] = await db.promise().query(
        `SELECT p.id, p.name, p.description, p.price, p.units_in_stock as stock, 
                p.image, p.Tag as tag, c.name as category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id`
      );
      res.json(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Get single product by ID
  router.get("/:id", async (req, res) => {
    try {
      const [product] = await db.promise().query(
        `SELECT p.id, p.name, p.description, p.price, p.units_in_stock as stock, 
                p.image, p.Tag as tag, c.name as category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`,
        [req.params.id]
      );
      
      if (!product || product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product[0]);
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Get products by category
  router.get("/category/:tag", async (req, res) => {
    try {
      const [products] = await db.promise().query(
        `SELECT p.id, p.name, p.description, p.price, p.units_in_stock as stock, 
                p.image, p.Tag as tag, c.name as category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.Tag LIKE ?`,
        [`%${req.params.tag}%`]
      );
      res.json(products);
    } catch (err) {
      console.error("Error fetching products by category:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Add new product (admin only)
  router.post("/", async (req, res) => {
    const { name, description, price, stock, tag } = req.body;
  
    if (!name || !price || !tag) {
      return res.status(400).json({ error: "Name, price, and tag are required" });
    }

    try {
      const [result] = await db.promise().query(
        "INSERT INTO products (name, description, price, units_in_stock, Tag, category_id, supplier_id) VALUES (?, ?, ?, ?, ?, 1, 1)",
        [name, description, price, stock || 0, tag]
      );
      
      const [newProduct] = await db.promise().query(
        "SELECT * FROM products WHERE id = ?",
        [result.insertId]
      );
      
      res.status(201).json(newProduct[0]);
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Update product (admin only)
  router.put("/:id", async (req, res) => {
    const { name, description, price, stock, tag } = req.body;
  
    try {
      await db.promise().query(
        `UPDATE products 
         SET name = COALESCE(?, name),
             description = COALESCE(?, description),
             price = COALESCE(?, price),
             units_in_stock = COALESCE(?, units_in_stock),
             Tag = COALESCE(?, Tag)
         WHERE id = ?`,
        [name, description, price, stock, tag, req.params.id]
      );
      
      const [updatedProduct] = await db.promise().query(
        "SELECT * FROM products WHERE id = ?",
        [req.params.id]
      );
      
      if (updatedProduct.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(updatedProduct[0]);
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Delete product (admin only)
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await db.promise().query("DELETE FROM products WHERE id = ?", [req.params.id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  return router;
};