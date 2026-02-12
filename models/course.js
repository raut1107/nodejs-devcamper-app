const mongoose = require("mongoose");
const slugify = require("slugify");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // this is the field that will hold the reference to the bootcamp model
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "bootcamps", // this is the name of the model we want to reference
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
