const express = require("express");
const router = express.Router();
const restaurantCtrl = require("../controller/restaurant_controller");
const { auth, role } = require("../middleware/auth");

// --- ผู้ดูแลร้าน (Restaurant) ---

router.get("/me", auth, role("restaurant"), restaurantCtrl.getMyRestaurant);

router.put("/me", auth, role("restaurant"), restaurantCtrl.updateRestaurant);

// --- Admin ---

router.get("/", auth, role("admin"), restaurantCtrl.listRestaurants);


router.put("/approve/:id", auth, role("admin"), restaurantCtrl.approveRestaurant);

module.exports = router;
 