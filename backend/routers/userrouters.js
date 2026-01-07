const express = require("express");
const router = express.Router();

const userCtrl = require("../controller/userctrl");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");


router.get("/profile", auth, userCtrl.getProfile);

router.put("/profile", auth, userCtrl.updateProfile);


router.put("/change-password", auth, userCtrl.changePassword);


router.put(
  "/avatar",
  auth,
  upload.single("avatar"),
  userCtrl.updateAvatar
);

module.exports = router;
