const express = require("express");
const db = require("../db");

module.exports = (bcrypt) => {
  const router = express.Router();

  // הרשמה
  router.post("/register", (req, res) => {
    const { username, Last_Name, email, phone, password } = req.body;

    if (!username || !Last_Name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username],
      (err, existingUser) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }
        if (existingUser.length > 0) {
          const duplicateMsg =
            existingUser[0].email === email
              ? "Email already exists"
              : "Username already exists";
          return res.status(409).json({ message: duplicateMsg });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
          }

          db.query(
            "INSERT INTO users (username, Last_Name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
            [username, Last_Name, email, phone, hashedPassword],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Server error" });
              }
              res.status(201).json({ message: "User registered successfully" });
            }
          );
        });
      }
    );
  });

  // התחברות
  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      const user = result[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(password, user.password, (err, isPasswordValid) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password" });
        }

        const { password: _, ...safeUser } = user;
        res.status(200).json({ message: "Login successful", user: safeUser });
      });
    });
  });

  // קבלת משתמש לפי ID
  router.get("/:id", (req, res) => {
    db.query(
      "SELECT id, username, Last_Name, email, phone, city, is_admin FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }
        if (!rows.length)
          return res.status(404).json({ message: "User not found" });
        res.json({ user: rows[0] });
      }
    );
  });

  // כל ההזמנות של משתמש
  router.get("/:id/orders", (req, res) => {
    db.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [req.params.id],
      (err, orders) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ orders });
      }
    );
  });

  return router;
};
