const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  
  originalLink: { type: String, required: true },
  shortLinkId: { type: String, required: true, unique: true },
  remarks:{type:String,required:true},
  clicks: { type: Number, default: 0 },
  expiration: { type: Date },
  status: { type: String, default: "active" },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  analytics: [{ type: Schema.Types.ObjectId, ref: 'Analytics' }]
});

module.exports = mongoose.model('Link', linkSchema);
