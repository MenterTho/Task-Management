const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  columns: [{
    id: String,
    title: String,
    taskIds: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
  }],
  visibility: { type: String, enum: ['public', 'private', 'team'], default: 'private' },
  labels: [{ id: String, name: String, color: String }],
  workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  displayMode: { type: String, enum: ['kanban', 'gantt', 'calendar'], default: 'kanban' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProjectSchema.index({ workspaceId: 1 }); 
ProjectSchema.index({ owner: 1 }); 
ProjectSchema.index({ members: 1 }); 
ProjectSchema.index({ 'columns.taskIds': 1 }); 
module.exports = mongoose.model('Project', ProjectSchema);