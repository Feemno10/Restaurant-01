const { pool } = require('./conn');

async function createReview(customer_id, food_id, rating, comment) {
    const conn = await pool.getConnection();
    try {
        const result = await conn.query(
            `INSERT INTO reviews 
             (customer_id, food_id, rating, comment)
             VALUES (?, ?, ?, ?)`,
            [customer_id, food_id, rating, comment]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
}


async function getReviewsByFood(food_id) {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            `SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                u.first_name,
                u.last_name,
                u.avatar
             FROM reviews r
             JOIN users u ON r.customer_id = u.id
             WHERE r.food_id = ?
             ORDER BY r.created_at DESC`,
            [food_id]
        );
        return rows;
    } finally {
        conn.release();
    }
}


async function checkUserReview(customer_id, food_id) {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            `SELECT id 
             FROM reviews 
             WHERE customer_id=? AND food_id=?`,
            [customer_id, food_id]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
}

async function deleteReview(id, customer_id) {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            `DELETE FROM reviews 
             WHERE id=? AND customer_id=?`,
            [id, customer_id]
        );
    } finally {
        conn.release();
    }
}


async function listAllReviews() {
    const conn = await pool.getConnection();
    try {
        const rows = await conn.query(
            `SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                f.name AS food_name,
                u.email AS customer_email
             FROM reviews r
             JOIN foods f ON r.food_id = f.id
             JOIN users u ON r.customer_id = u.id
             ORDER BY r.created_at DESC`
        );
        return rows;
    } finally {
        conn.release();
    }
}

module.exports = {
    createReview,
    getReviewsByFood,
    checkUserReview,
    deleteReview,
    listAllReviews
};
