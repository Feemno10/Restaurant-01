const express = require("express");
const router = express.Router();
const FoodCtrl = require("../controller/foodctrl");
const upload = require("../middleware/upload");
const { auth, role } = require("../middleware/auth");


router.get("/restaurant/:restaurant_id", FoodCtrl.getFoodsByRestaurant);
router.get("/:id", FoodCtrl.getFoodById);

router.post("/", auth,  role("admin", "restaurant"),  upload.single("image"), FoodCtrl.createFood);


router.put(  "/:id", auth, role("admin", "restaurant"), upload.single("image"), FoodCtrl.updateFood);


router.delete(  "/:id", auth, role("admin", "restaurant"), FoodCtrl.deleteFood);

module.exports = router;
