const mongoose = require('mongoose');
const Student = require('./Student');

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: Student }]
});

module.exports = mongoose.model('Mentor', MentorSchema);
