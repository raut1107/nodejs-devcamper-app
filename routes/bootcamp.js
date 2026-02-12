const express = require("express");
const router = express.Router();
const controler = require("../controllers/bootcamp");

// Include other resources router

const courseRouter = require("./courses");
// re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

//  call to the controller functions
router.get("/", controler.getBootcamps);
router.get("/:id", controler.getBootcamp);
router.post("/", controler.createBootcamp);
router.put("/:id", controler.updateBootcamp);
router.delete("/:id", controler.deleteBootcamp);

module.exports = router;
