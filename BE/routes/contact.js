const express = require("express");
const db = require("../db");
const router = express.Router();

const GUEST_USER_ID = 9;

router.post("/", (req, res) => {
  const { name, email, subject, message, userId } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required",
    });
  }

  // פשוט מכניס את השדות ישירות
  const feedbackUserId = userId || GUEST_USER_ID;
  const UserName = name.trim();
  const Email = email.trim();
  const Subject = subject ? subject.trim() : "No Subject";
  const content = message.trim();

  db.query(
    "INSERT INTO feedback (user_id, content, created_at, UserName, Email, Subject) VALUES (?, ?, NOW(), ?, ?, ?)",
    [feedbackUserId, content, UserName, Email, Subject],
    (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to submit your message",
        });
      }

      res.status(201).json({
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
        id: results.insertId,
      });
    }
  );
});

module.exports = router;