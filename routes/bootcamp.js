const express = require("express");
const router = express.Router();
const controler = require("../controllers/bootcamp");
const Bootcamp = require("../models/bootcamp");
const advanceResult = require("../middleware/advanceResult");

// Include other resources router

const courseRouter = require("./courses");
// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

//  call to the controller functions
router.get("/", advanceResult(Bootcamp, "courses"), controler.getBootcamps); // implemented middleware for advance results of search filter sort pagination
router.get("/:id", controler.getBootcamp);
router.post("/", controler.createBootcamp);
router.put("/:id", controler.updateBootcamp);
router.delete("/:id", controler.deleteBootcamp);

router.put("/:id/photo", controler.bootcampPhotoUpload);

module.exports = router;
