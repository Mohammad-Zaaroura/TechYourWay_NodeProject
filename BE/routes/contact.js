const express = require('express');
const router = express.Router();

// Helper function to escape SQL values
const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Default user ID for guest feedback (use an existing user ID from your database)
const GUEST_USER_ID = 9; // Using the first user as default

module.exports = function(db) {
    // POST /api/contact - Submit contact form
    router.post('/', (req, res) => {
        try {
            // Simple validation
            const { name, email, subject, message, userId } = req.body;
            
            // Validate required fields
            if (!name || !email || !message) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Name, email, and message are required' 
                });
            }

            // Sanitize inputs
            const sanitizedData = {
                name: escapeHtml(name).trim(),
                email: escapeHtml(email).trim(),
                subject: subject ? escapeHtml(subject).trim() : 'No Subject',
                message: escapeHtml(message).trim(),
            };

            // Use provided userId or default to guest user ID
            const feedbackUserId = userId || GUEST_USER_ID;
            const content = `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nSubject: ${sanitizedData.subject}\n\n${sanitizedData.message}`;

            // Insert into database
            db.query(
                'INSERT INTO feedback (user_id, content, created_at) VALUES (?, ?, NOW())',
                [feedbackUserId, content],
                (error, results) => {
                    if (error) {
                        console.error('Database error:', error);
                        return res.status(500).json({ 
                            success: false,
                            error: 'Failed to submit your message',
                            details: error.message,
                            code: error.code
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Thank you for your message! We will get back to you soon.',
                        id: results.insertId
                    });
                }
            );
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({
                success: false,
                error: 'An unexpected error occurred',
                details: error.message
            });
        }
    });

    return router;
};
