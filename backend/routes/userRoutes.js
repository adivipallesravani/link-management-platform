const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user"); // Import User model
const authenticate = require("../middleware/authMiddleware"); // Middleware for route protection

const { registerUser, loginUser, updateUser, deleteUser } = require("../controllers/userControllers");

// Register user
router.post("/register", registerUser);  // Remove `/api/` part
// Login user
router.post("/login", loginUser); // Remove `/api/` part

router.get("/user-details", authenticate, async (req, res) => {
    console.log("Authenticated user:", req.user); // Check if user is attached to req.user
    try {
        const user = await User.findById(req.user.userId); // Fetch user using ID from token
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error); // Log error to debug
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// PUT update user details (protected route)
router.put("/update-user", authenticate, async (req, res) => {
    const { name, email, mobile } = req.body;

    if (!email || !mobile) {  // Check only if email or mobile is provided
        console.log("Missing required fields:", { name, email, mobile });
        return res.status(400).json({ message: "Email and mobile are required!" });
    }

    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            console.log("User not found!");
            return res.status(404).json({ message: "User not found!" });
        }

        // Prepare the update object
        const updateObj = {};

        if (name) updateObj.name = name;
        if (email) updateObj.email = email;
        if (mobile) updateObj.mobile = mobile;

        // Update the user with the provided fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            updateObj,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            console.log("Failed to update user.");
            return res.status(400).json({ message: "Failed to update user." });
        }

        console.log("User updated successfully:", updatedUser);

        // Check if the email was updated
        if (email && email !== user.email) {
            return res.status(200).json({
                message: "Email updated. Please log in again.",
                needLogout: true
            });
        }

        res.status(200).json({
            message: "User updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
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
