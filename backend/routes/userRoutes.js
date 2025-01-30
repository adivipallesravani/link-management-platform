const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user"); // Import User model
const authenticate = require("../middleware/authMiddleware"); // Middleware for route protection
const { generateToken } = require("../utils/jwtUtils"); // Import token generator
const { registerUser, loginUser, updateUser, deleteUser } = require("../controllers/userControllers");

// Register user
router.post("/register", registerUser);  // Remove `/api/` part
// Login user
router.post("/login", loginUser); // Remove `/api/` part

// GET user details (protected route)
router.get("/user", authenticate, async (req, res) => {  // Remove `/api/` part
    try {
        const user = await User.findById(req.user.userId); // Fetch user using ID from token
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT update user details (protected route)
router.put("/update-user", authenticate, async (req, res) => {  // Remove `/api/` part
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Invalid JSON input" });
    }

    const { name, email, mobile } = req.body;

    // Validate that all fields are provided
    if (!name || !email || !mobile) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        // Find and update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId, // User ID from token
            { name, email, mobile },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User updated successfully!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// DELETE user account
router.delete("/delete-user", authenticate, async (req, res) => {  // Remove `/api/` part
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
