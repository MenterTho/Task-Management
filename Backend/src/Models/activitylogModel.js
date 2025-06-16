const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityLogSchema = new Schema({
  resourceType: { type: String, enum: ['project', 'task'], required: true },
  resourceId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, required: true },
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

ActivityLogSchema.index({ resourceId: 1, resourceType: 1 }); 
ActivityLogSchema.index({ actor: 1 }); 
ActivityLogSchema.index({ createdAt: -1 }); 

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);