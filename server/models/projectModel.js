const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  props: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  components: [componentSchema],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
