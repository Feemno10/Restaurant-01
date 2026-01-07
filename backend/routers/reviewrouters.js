const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controller/reviewctrl');
const auth = require('../middleware/auth');     
const { auth, role } = require('../middleware/auth');

router.post('/', auth, reviewCtrl.createReview);
router.delete('/:id', auth, reviewCtrl.deleteReview);


router.get('/food/:food_id', reviewCtrl.getReviewsByFood);


router.get('/admin/all', auth, ("admin") ,reviewCtrl.listAllReviews);

module.exports = router;
