const express = require("express");
const router = express.Router();
const controler = require("../controllers/bootcamp");
const Bootcamp = require("../models/bootcamp");
const advanceResult = require("../middleware/advanceResult");
const { protect, authorize } = require("../middleware/auth");
// Include other resources router

const courseRouter = require("./courses");
const reviewRouter = require("./review");
// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

//  call to the controller functions
router.get("/", advanceResult(Bootcamp, "courses"), controler.getBootcamps); // implemented middleware for advance results of search filter sort pagination
router.get("/:id", controler.getBootcamp);
router.post("/", protect, controler.createBootcamp);
router.put(
  "/:id",
  protect,
  authorize("publisher", "admin"),
  controler.updateBootcamp,
);
router.delete(
  "/:id",
  protect,
  authorize("publisher", "admin"),
  controler.deleteBootcamp,
);

router.put(
  "/:id/photo",
  protect,
  authorize("publisher", "admin"),
  controler.bootcampPhotoUpload,
);

module.exports = router;
