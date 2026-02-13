const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/courses");
const Course = require("../models/course");
const advanceResult = require("../middleware/advanceResult");
const { protect, authorize } = require("../middleware/auth");
//  call to the controller functions
router.get(
  "/",
  advanceResult(Course, { path: "bootcamp", select: "name description" }),
  controller.getCourses,
);
router.get("/:id", controller.getCourse);
router.post(
  "/",
  protect,
  authorize("publisher", "admin"),
  controller.createCourse,
);
router.put(
  "/:id",
  protect,
  authorize("publisher", "admin"),
  controller.updateCourse,
);
router.delete(
  "/:id",
  protect,
  authorize("publisher", "admin"),
  controller.deleteCourse,
);

module.exports = router;
