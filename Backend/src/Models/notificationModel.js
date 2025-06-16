const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['task_assigned', 'deadline', 'comment', 'update'], required: true },
  message: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId },
  resourceType: { type: String, enum: ['project', 'task'] },
  action: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ recipientId: 1 });
NotificationSchema.index({ resourceId: 1, resourceType: 1 });
NotificationSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);