const express = require("express");
const db = require("../db");
const router = express.Router();

// Get user's cart
router.get("/:user_id", (req, res) => {
  db.query(
    `SELECT c.*, p.name, p.price, p.image 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = ?`,
    [req.params.user_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// Add item to cart
router.post("/", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if item already in cart
  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, existing) => {
      if (err) {
        console.error("Error checking cart:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (existing.length > 0) {
        // Update quantity if item exists
        db.query(
          "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
          [quantity, user_id, product_id],
          (err2, result2) => {
            if (err2) {
              console.error("Error updating cart:", err2);
              return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ message: "Item added to cart" });
          }
        );
      } else {
        // Add new item
        db.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [user_id, product_id, quantity],
          (err3, result3) => {
            if (err3) {
              console.error("Error adding to cart:", err3);
              return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ message: "Item added to cart" });
          }
        );
      }
    }
  );
});

// Update cart item quantity
router.put("/:id", (req, res) => {
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ error: "Quantity is required" });
  }

  db.query(
    "UPDATE cart SET quantity = ? WHERE id = ?",
    [quantity, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error updating cart:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ message: "Cart updated successfully" });
    }
  );
});

// Remove item from cart
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM cart WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      console.error("Error removing from cart:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json({ message: "Item removed from cart" });
  });
});

module.exports = router;
