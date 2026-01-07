const express = require('express');
const router = express.Router();
const riderCtrl = require('../controller/riderctrl');
const upload = require('../middleware/upload');
const { auth, role } = require('../middleware/auth');

router.get('/profile', auth, role('rider'), riderCtrl.getProfile);
router.put('/profile', auth, role('rider'), riderCtrl.updateProfile);
router.put('/password', auth, role('rider'), riderCtrl.changePassword);
router.put('/avatar', auth,role('rider'),upload.single('avatar'),riderCtrl.uploadAvatar);

router.get('/orders', auth, role('rider'), riderCtrl.availableOrders);
router.get('/orders/:id', auth, role('rider'), riderCtrl.orderDetail);
router.put('/orders/:id/accept', auth, role('rider'), riderCtrl.acceptOrder);
router.put('/orders/:id/complete', auth, role('rider'), riderCtrl.completeOrder);

module.exports = router;
