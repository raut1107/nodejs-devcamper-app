const express = require("express");
const controller = require("../controllers/user");
const advanceResult = require("../middleware/advanceResult");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  advanceResult(User),
  controller.getUsers,
);
router.get("/:id", protect, authorize("admin"), controller.getUser);
router.post("/", protect, authorize("admin"), controller.createUser);
router.put("/:id", protect, authorize("admin"), controller.updateUser);
router.delete("/:id", protect, authorize("admin"), controller.deleteUser);

module.exports = router;
