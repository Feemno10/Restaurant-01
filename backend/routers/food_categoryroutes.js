const express = require('express');
const router = express.Router();
const ctrl = require('../controller/food_categoryctrl');
const { auth , role } = require('../middleware/auth');

router.use(auth);
router.use(role("restaurant", "admin"));


router.post("/", categoryCtrl.createCategory);


router.get("/", categoryCtrl.getCategories);

router.put("/:id", categoryCtrl.updateCategory);

router.delete("/:id", categoryCtrl.deleteCategory);

module.exports = router;