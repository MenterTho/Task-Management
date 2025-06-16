const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SharedLinkSchema = new Schema({
  token: { type: String, required: true, unique: true },
  resourceType: { type: String, enum: ['project', 'task'], required: true },
  resourceId: { type: Schema.Types.ObjectId, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accessLevel: { type: String, enum: ['view', 'edit'], default: 'view' },
  password: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

SharedLinkSchema.index({ token: 1 }); 
SharedLinkSchema.index({ resourceId: 1, resourceType: 1 }); 
SharedLinkSchema.index({ createdBy: 1 }); 

module.exports = mongoose.model('SharedLink', SharedLinkSchema);