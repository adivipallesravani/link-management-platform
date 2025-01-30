const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    originalLink: { type: String, required: true },
    shortLinkId: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userDevice: { type: String, required: true },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
