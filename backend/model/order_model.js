const { pool } = require('./conn');

/**
 * สร้างออเดอร์ใหม่ (ลูกค้า)
 */
async function createOrder(user_id, restaurant_id, total_price) {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO orders (user_id, restaurant_id, total_price)
             VALUES (?, ?, ?)`,
            [user_id, restaurant_id, total_price]
        );
        return result.insertId;
    } finally {
        conn.release();
    }
}

/**
 * ดึงออเดอร์ตาม ID
 */
async function getOrderById(id) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM orders WHERE id=?`,
            [id]
        );
        return rows[0] || null;
    } finally {
        conn.release();
    }
}

/**
 * ออเดอร์ของลูกค้า
 */
async function getOrdersByUser(user_id) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM orders
             WHERE user_id=?
             ORDER BY created_at DESC`,
            [user_id]
        );
        return rows;
    } finally {
        conn.release();
    }
}

/**
 * ออเดอร์ของร้านอาหาร
 */
async function getOrdersByRestaurant(restaurant_id) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM orders
             WHERE restaurant_id=?
             ORDER BY created_at DESC`,
            [restaurant_id]
        );
        return rows;
    } finally {
        conn.release();
    }
}

/**
 * ออเดอร์ที่ยังไม่มีไรเดอร์ (สำหรับ rider)
 */
async function getAvailableOrders() {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM orders
             WHERE status='paid' AND rider_id IS NULL`
        );
        return rows;
    } finally {
        conn.release();
    }
}

/**
 * Rider รับงาน
 */
async function assignRider(order_id, rider_id) {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            `UPDATE orders
             SET rider_id=?, status='delivering'
             WHERE id=? AND rider_id IS NULL`,
            [rider_id, order_id]
        );
    } finally {
        conn.release();
    }
}

/**
 * เปลี่ยนสถานะออเดอร์
 */
async function updateOrderStatus(order_id, status) {
    const conn = await pool.getConnection();
    try {
        await conn.query(
            `UPDATE orders SET status=? WHERE id=?`,
            [status, order_id]
        );
    } finally {
        conn.release();
    }
}

/** ออเดอร์ทั้งหมด (admin)*/
async function listAllOrders() {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM orders ORDER BY created_at DESC`
        );
        return rows;
    } finally {
        conn.release();
    }
}

module.exports = {
    createOrder,
    getOrderById,
    getOrdersByUser,
    getOrdersByRestaurant,
    getAvailableOrders,
    assignRider,
    updateOrderStatus,
    listAllOrders
};
