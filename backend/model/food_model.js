const { pool } = require('./conn');

async function creafood(category_id , name , price , image = null , discount_percent = 0  ) {
    const conn = await pool.getConnection();
    try{
       const result = await conn.query(
            `INSERT INTO foods (category_id, name, price, image, discount_percent) 
             VALUES (?, ?, ?, ?, ?)`,
            [category_id, name, price, image, discount_percent]
        );
        return result.insertId
    }finally{
        conn.release();
    }
};

async function getFoodsByCategory(category_id) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT f.id, f.name, f.price, f.image, f.discount_percent, c.name AS category_name
             FROM foods f
             JOIN food_categories c ON f.category_id = c.id
             WHERE f.category_id = ?
             ORDER BY f.id DESC`,
            [category_id]
        );
        return rows;
    } finally {
        conn.release();
    }
}


async function getFoodById(id) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(`SELECT * FROM foods WHERE id = ?`, [id]);
        return rows[0] || null;
    } finally {
        conn.release();
    }
}


async function updateFood(id, category_id, name, price, image = null, discount_percent = 0) {
    const conn = await pool.getConnection();
    try {
        const sql = `UPDATE foods 
                     SET category_id = ?, name = ?, price = ?, discount_percent = ? 
                     ${image ? ", image = ?" : ""} 
                     WHERE id = ?`;
        const params = image ? [category_id, name, price, discount_percent, image, id] : [category_id, name, price, discount_percent, id];
        await conn.query(sql, params);
    } finally {
        conn.release();
    }
}


async function deleteFood(id) {
    const conn = await pool.getConnection();
    try {
        await conn.query(`DELETE FROM foods WHERE id = ?`, [id]);
    } finally {
        conn.release();
    }
}


async function getFoodsByRestaurant(restaurant_id) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT f.id, f.name, f.price, f.image, f.discount_percent, c.name AS category_name
             FROM foods f
             JOIN food_categories c ON f.category_id = c.id
             WHERE c.restaurant_id = ?
             ORDER BY f.id DESC`,
            [restaurant_id]
        );
        return rows;
    } finally {
        conn.release();
    }
}

module.exports = {
    createFood,
    getFoodsByCategory,
    getFoodsByRestaurant,
    getFoodById,
    updateFood,
    deleteFood
};