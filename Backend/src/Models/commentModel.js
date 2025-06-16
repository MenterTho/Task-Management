const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reactions: [{ userId: Schema.Types.ObjectId, emoji: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CommentSchema.index({ taskId: 1 }); 
CommentSchema.index({ author: 1 }); 

module.exports = mongoose.model('Comment', CommentSchema);