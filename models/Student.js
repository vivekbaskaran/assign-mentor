const mongoose = require('mongoose');
const Mentor = require('./Mentor');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor'},
  previousMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: Mentor }]
});

module.exports = mongoose.model('Student', StudentSchema);
