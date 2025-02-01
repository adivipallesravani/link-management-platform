const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analyticsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Add userId
  timestamp: { type: Date, default: Date.now },
  device: { type: String },
  ipAddress: { type: String },
  os: { type: String },
  browser: { type: String },
  originalLink: { type: String },
  shortLink: { type: String },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
