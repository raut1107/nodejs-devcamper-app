const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/course");
const bootcamps = require("../models/bootcamp");

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp", // this is the name of the field in the course model
      select: "name description", // this is the field we want to select from the bootcamp model
    });
  }

  const courses = await query;
  res.status(200).json({ success: true, count: courses.lenth, data: courses });
});

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
  }

  res.status(200).json({ success: true, count: course.length, data: course });
});

// @desc    Create course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId; // add bootcampId to req.body
  const bootcamp = await bootcamps.findById(req.params.bootcampId);

  if (!bootcamp) {
    throw new ErrorResponse(
      `No bootcamp with the id of ${req.params.bootcampId}`,
      404,
    );
  }
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});

// @desc    Create course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  console.log("inside update Course");
  console.log("--------------", req);
  let course = await Course.findById(req.params.id);

  if (!course) {
    throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: course });
});

//@dec Delete course
//@route DELETE /api/v1/courses/:id
//@access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  console.log("inside delete Course");
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new ErrorResponse(`No course with the id of ${req.params.id}`, 404);
  }

  await course.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
