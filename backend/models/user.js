const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true,
        match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update `modifiedAt` before saving
userSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.modifiedAt = Date.now(); // Update the `modifiedAt` field if the document is modified
    }
    next();
});


module.exports = mongoose.model("User", userSchema);
