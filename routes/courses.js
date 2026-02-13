const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/courses");
const Course = require("../models/course");
const advanceResult = require("../middleware/advanceResult");

//  call to the controller functions
router.get(
  "/",
  advanceResult(Course, { path: "bootcamp", select: "name description" }),
  controller.getCourses,
);
router.get("/:id", controller.getCourse);
router.post("/", controller.createCourse);
router.put("/:id", controller.updateCourse);
router.delete("/:id", controller.deleteCourse);

module.exports = router;
