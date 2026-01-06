const express = require('express');
const router = express.Router();
const ctrl = require('../controller/adminctrl');
const { auth , role } = require('../middleware/auth')

router.use(auth , role("admin"));

router.put('/updateprofile' , ctrl.updateProfile);
router.put('/updatepass' , ctrl.changePassword);

router.post('/create' , ctrl.createUserByAdmin);
router.put('/approve/:id' , ctrl.approveUser);
router.put('/ban' , ctrl.banUser);

router.get('/listuser' , ctrl.listAllUser);
router.get('/listres' , ctrl.listRestaurants);
router.get('/listrider' , ctrl.listRiders);

module.exports = router;
