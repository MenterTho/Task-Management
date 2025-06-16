const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  startDate: { type: Date },
  assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  subtasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  checklists: [{
    id: String,
    title: String,
    items: [{ text: String, completed: Boolean }]
  }],
  timeSpent: { type: Number, default: 0 },
  customFields: [{ key: String, value: String }],
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  labels: [{ type: String }],
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaskSchema.index({ projectId: 1 }); 
TaskSchema.index({ status: 1 }); 
TaskSchema.index({ assignees: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ labels: 1 }); 

module.exports = mongoose.model('Task', TaskSchema);