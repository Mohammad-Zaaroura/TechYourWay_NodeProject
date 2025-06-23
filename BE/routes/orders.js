const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get user's orders
  router.get("/:user_id", async (req, res) => {
    try {
      const userId = req.params.user_id;
      const [results] = await db.query(
        `SELECT o.*, oi.quantity, p.name, p.price, p.image 
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = ?`,
        [userId]
      );
      res.json(results);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Create a new order
  router.post("/", async (req, res) => {
    const { user_id, items, total, shipping_address } = req.body;
    
    if (!user_id || !items || !items.length || !total || !shipping_address) {
      return res.status(400).json({ error: "All fields required." });
    }

    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const orderQuery = `
        INSERT INTO orders (user_id, total, status, shipping_address)
        VALUES (?, ?, 'pending', ?)
      `;

      const [result] = await connection.query(orderQuery, [user_id, total, shipping_address]);

      const orderId = result.insertId;
      const orderItems = items.map(item => [
        orderId, 
        item.product_id, 
        item.quantity, 
        item.price
      ]);

      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?",
        [orderItems]
      );

      // Clear user's cart after successful order
      await connection.query("DELETE FROM cart WHERE user_id = ?", [user_id]);

      await connection.commit();
      res.status(201).json({ message: "Order created successfully", orderId });
    } catch (err) {
      await connection.rollback();
      console.error("Error creating order:", err);
      res.status(500).json({ error: "Failed to create order" });
    } finally {
      connection.release();
    }
  });

  // Update order status
  router.put("/:id/status", async (req, res) => {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    try {
      const [result] = await db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, req.params.id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ message: "Order status updated successfully" });
    } catch (err) {
      console.error("Error updating order status:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  // Get order details
  router.get("/details/:order_id", async (req, res) => {
    try {
      const [order] = await db.query(
        `SELECT o.*, u.username, u.email, u.phone 
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [req.params.order_id]
      );

      if (!order.length) {
        return res.status(404).json({ error: "Order not found" });
      }

      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [req.params.order_id]
      );

      res.json({
        ...order[0],
        items
      });
    } catch (err) {
      console.error("Error fetching order details:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  return router;
};