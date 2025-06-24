const express = require("express");
const db = require("../db");
const router = express.Router();

// Get user's orders
router.get("/:user_id", (req, res) => {
  const userId = req.params.user_id;
  db.query(
    `SELECT o.*, oi.quantity, p.name, p.price, p.image 
     FROM orders o
     JOIN order_items oi ON o.id = oi.order_id
     JOIN products p ON oi.product_id = p.id
     WHERE o.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// Create a new order
router.post("/", (req, res) => {
  const { user_id, items, total, shipping_address } = req.body;

  if (!user_id || !items || !items.length || !total || !shipping_address) {
    return res.status(400).json({ error: "All fields required." });
  }

  db.query(
    "INSERT INTO orders (user_id, total, status, shipping_address) VALUES (?, ?, 'pending', ?)",
    [user_id, total, shipping_address],
    (err, result) => {
      if (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({ error: "Failed to create order" });
      }
      const orderId = result.insertId;

      const orderItems = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);
      db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?",
        [orderItems],
        (err2, result2) => {
          if (err2) {
            console.error("Error adding order items:", err2);
            return res.status(500).json({ error: "Failed to add order items" });
          }
          db.query(
            "DELETE FROM cart WHERE user_id = ?",
            [user_id],
            (err3, result3) => {
              if (err3) {
                console.error("Error clearing cart:", err3);
                return res
                  .status(500)
                  .json({ error: "Order added, but failed to clear cart" });
              }
              res
                .status(201)
                .json({ message: "Order created successfully", orderId });
            }
          );
        }
      );
    }
  );
});

// Update order status
router.put("/:id/status", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ message: "Order status updated successfully" });
    }
  );
});

// Get order details
router.get("/details/:order_id", (req, res) => {
  db.query(
    `SELECT o.*, u.username, u.email, u.phone 
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`,
    [req.params.order_id],
    (err, order) => {
      if (err) {
        console.error("Error fetching order details:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (!order.length) {
        return res.status(404).json({ error: "Order not found" });
      }

      db.query(
        `SELECT oi.*, p.name, p.image 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [req.params.order_id],
        (err2, items) => {
          if (err2) {
            console.error("Error fetching order items:", err2);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({
            ...order[0],
            items,
          });
        }
      );
    }
  );
});

module.exports = router;
