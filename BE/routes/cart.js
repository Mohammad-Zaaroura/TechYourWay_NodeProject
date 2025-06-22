const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get user's cart
  router.get("/:user_id", async (req, res) => {
    try {
      const [results] = await db.query(
        `SELECT c.*, p.name, p.price, p.image 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`,
        [req.params.user_id]
      );
      res.json(results);
    } catch (err) {
      console.error("Error fetching cart:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Add item to cart
  router.post("/", async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if item already in cart
      const [existing] = await db.query(
        "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
        [user_id, product_id]
      );

      if (existing.length > 0) {
        // Update quantity if item exists
        await db.query(
          "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
          [quantity, user_id, product_id]
        );
      } else {
        // Add new item
        await db.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [user_id, product_id, quantity]
        );
      }

      res.status(201).json({ message: "Item added to cart" });
    } catch (err) {
      console.error("Error adding to cart:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Update cart item quantity
  router.put("/:id", async (req, res) => {
    const { quantity } = req.body;
    
    if (!quantity) {
      return res.status(400).json({ error: "Quantity is required" });
    }

    try {
      const [result] = await db.query(
        "UPDATE cart SET quantity = ? WHERE id = ?",
        [quantity, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json({ message: "Cart updated successfully" });
    } catch (err) {
      console.error("Error updating cart:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Remove item from cart
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await db.query("DELETE FROM cart WHERE id = ?", [req.params.id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (err) {
      console.error("Error removing from cart:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  return router;
};