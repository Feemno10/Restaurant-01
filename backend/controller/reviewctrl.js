const reviewModel = require('../model/review_model');

exports.createReview = async (req, res) => {
    try {
        const customer_id = req.user.id; // มาจาก middleware auth
        const { food_id, rating, comment } = req.body;

        if (!food_id || !rating) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
        }

        // ตรวจสอบว่าเคยรีวิวแล้วหรือยัง
        const already = await reviewModel.checkUserReview(customer_id, food_id);
        if (already) {
            return res.status(400).json({ message: 'คุณรีวิวเมนูนี้ไปแล้ว' });
        }

        const reviewId = await reviewModel.createReview(
            customer_id,
            food_id,
            rating,
            comment || null
        );

        res.status(201).json({
            message: 'รีวิวสำเร็จ',
            review_id: reviewId
        });
    } catch (err) {
        console.error('CREATE REVIEW ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getReviewsByFood = async (req, res) => {
    try {
        const { food_id } = req.params;

        const reviews = await reviewModel.getReviewsByFood(food_id);

        res.json(reviews);
    } catch (err) {
        console.error('GET REVIEWS ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteReview = async (req, res) => {
    try {
        const customer_id = req.user.id;
        const { id } = req.params;

        await reviewModel.deleteReview(id, customer_id);

        res.json({ message: 'ลบรีวิวเรียบร้อย' });
    } catch (err) {
        console.error('DELETE REVIEW ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.listAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.listAllReviews();
        res.json(reviews);
    } catch (err) {
        console.error('LIST REVIEWS ERROR:', err);
        res.status(500).json({ message: 'Server error' });
    }
};