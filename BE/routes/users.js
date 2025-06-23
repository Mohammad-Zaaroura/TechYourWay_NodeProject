const express = require("express");

module.exports = (db, bcrypt) => {
  const router = express.Router();

  // הרשמה
  router.post("/register", async (req, res) => {
    const { username, Last_Name, email, phone, password } = req.body;

    if (!username || !Last_Name || !email || !phone || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
      // check email or username duplicates
      const [existingUser] = await db
        .promise()
        .query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username]);

      if (existingUser.length > 0) {
        const duplicateMsg = existingUser[0].email === email ? "Email already exists" : "Username already exists";
        return res.status(409).json({ message: duplicateMsg });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db
        .promise()
        .query(
          "INSERT INTO users (username, Last_Name, email, phone, password) VALUES (?, ?, ?, ?, ?)",
          [username, Last_Name, email, phone, hashedPassword]
        );

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // התחברות
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const [result] = await db
        .promise()
        .query("SELECT * FROM users WHERE email = ?", [email]);

      const user = result[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // מחזיר את המשתמש ללא הסיסמה
      const { password: _, ...safeUser } = user;
      res.status(200).json({ message: "Login successful", user: safeUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT id, username, Last_Name, email, phone, city, is_admin FROM users WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.status(404).json({ message: 'User not found' });
      res.json({ user: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/:id/orders', async (req, res) => {
    try {
      const [orders] = await db.promise().query('SELECT * FROM orders WHERE user_id = ?', [req.params.id]);
      res.json({ orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
