const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  content: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  threadId: { type: Schema.Types.ObjectId, ref: 'Message' },
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});
MessageSchema.index({ projectId: 1 });
MessageSchema.index({ sender: 1 }); 
MessageSchema.index({ createdAt: -1 }); 

module.exports = mongoose.model('Message', MessageSchema);