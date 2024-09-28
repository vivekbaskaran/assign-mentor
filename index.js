const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const app = express();
app.use(express.json());

// Connect to MongoDB - replace 'your_database_url' with your actual MongoDB URL
mongoose.connect('mongodb+srv://buvivivek:vivek123@cluster0.5bq6a.mongodb.net/mentorStudentDB?authSource=admin&compressors=zlib&retryWrites=true&w=majority&ssl=true');
//mongodb://127.0.0.1:27017/mentorStudentDB
// Define the Mentor and Student models
const Mentor = mongoose.model('Mentor', new mongoose.Schema({
  name: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}));

const Student = mongoose.model('Student', new mongoose.Schema({
  name: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
  previousMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: Mentor }]
}));

// Write API to create Mentor
app.post('/mentors', async (req, res) => {
  const mentor = new Mentor(req.body);
  await mentor.save();
  res.status(201).send(mentor);
});

// Write API to create Student
app.post('/students', async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).send(student);
});

// Write API to Assign a student to Mentor
app.post('/mentors/:mentorId/students/:studentId', async (req, res) => {
  //const { mentorId, studentId } = req.params;
  try {
    const mentorId = new ObjectId(req.params.mentorId); // Cast to ObjectId
    const studentId = new ObjectId(req.params.studentId); // Cast to ObjectId
    const mentor = await Mentor.findById(mentorId);
    const student = await Student.findById(studentId);
    if (!mentor || !student) {
      return res.status(404).send({ message: 'Mentor or Student not found' });
    }
    // Check if the student already has this mentor assigned
    if (student.mentor && student.mentor.equals(mentorId)) {
      return res.status(400).send({ message: 'This student is already assigned to the mentor' });
    }
    mentor.students.push(student);
    student.mentor = mentor;
    await mentor.save();
    await student.save();
    res.status(200).send({ mentor, student });
  }
  catch (error) {
        res.status(500).send({ message: error.message })
  }

});

// Write API to Assign or Change Mentor for a particular Student
app.put('/students/:studentId/mentor/:mentorId', async (req, res) => {
  //const { studentId, mentorId } = req.params;
  try {
    const mentorId = new ObjectId(req.params.mentorId); // Cast to ObjectId
    const studentId = new ObjectId(req.params.studentId); // Cast to ObjectId
    const student = await Student.findById(studentId);
    if (student.mentor) {
    student.previousMentors.push(student.mentor); // save current mentor to previousMentors
    }
    student.mentor = mentorId;

    await student.save();
    res.status(200).send(student);
  } catch (error) {
        res.status(500).send({ message: error.message })
  }
});

// Write API to show all students for a particular mentor
app.get('/mentors/:mentorId/students', async (req, res) => {
  const { mentorId } = req.params;
  const mentor = await Mentor.findById(mentorId).populate('students');
  res.status(200).send(mentor.students);
});

// Write an API to show the previously assigned mentor for a particular student
app.get('/students/:studentId/mentor', async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId).populate('previousMentors');
  res.status(200).send(student.previousMentors);
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

