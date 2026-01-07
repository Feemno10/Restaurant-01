const express = require('express');
const router = express.Router();

const orderCtrl = require('../controller/orderctrl');
const { auth, role } = require('../middleware/auth');

router.post('/', auth,role('customer'),orderCtrl.createOrder);

router.get(  '/my',  auth, role('customer'), orderCtrl.myOrders);

router.get(
    '/restaurant/:restaurant_id',auth,role('restaurant'), orderCtrl.restaurantOrders);

router.put( '/:id/status', auth,role('restaurant'), orderCtrl.updateStatus);

/**RIDER*/
router.get( '/available',auth, role('rider'),orderCtrl.availableOrders
);

router.put('/:id/take',auth,role('rider'), orderCtrl.takeOrder);

/*** ADMIN*/
router.get( '/',auth,role('admin'),orderCtrl.listAllOrders);

module.exports = router;
