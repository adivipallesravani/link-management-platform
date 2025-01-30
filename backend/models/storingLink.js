const mongoose = require("mongoose");
const shortid = require("shortid");

const linkSchema = new mongoose.Schema({
    originalLink: { type: String, required: true },
    shortLinkId: { type: String, required: true, unique: true, default: shortid.generate },
    remarks: { type: String,required:true },
    clicks: { type: Number, default: 0 },
    expiration: { type: Date, default: null },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdAt: { type: String }, // Store date in the required format
    analytics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analytics' }]
}, { timestamps: true });

module.exports = mongoose.model("Link", linkSchema);
