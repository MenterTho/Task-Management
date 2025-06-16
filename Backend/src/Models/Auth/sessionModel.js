const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true, unique: true },
  deviceInfo: {
    deviceType: { type: String },
    os: { type: String }, 
    browser: { type: String } 
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date, default: Date.now }
});

SessionSchema.index({ userId: 1 }); 
SessionSchema.index({ accessToken: 1 }); 
SessionSchema.index({ refreshToken: 1 }); 
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', SessionSchema);