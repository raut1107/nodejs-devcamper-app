const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/courses");

//  call to the controller functions
router.get("/", controller.getCourses);
router.get("/:id", controller.getCourse);
router.post("/", controller.createCourse);
router.put("/:id", controller.updateCourse);
router.delete("/:id", controller.deleteCourse);

module.exports = router;
