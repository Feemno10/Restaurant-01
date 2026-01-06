const { pool } = require("./conn");

// สร้างหมวดหมู่ใหม่
async function createCategory(restaurant_id, name) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      "INSERT INTO food_categories (restaurant_id, name) VALUES (?, ?)",
      [restaurant_id, name]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}
                                                                    
// ดึงหมวดหมู่ทั้งหมดของร้าน
async function getCategoriesByRestaurant(restaurant_id) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, name FROM food_categories WHERE restaurant_id=? ORDER BY id ASC",
      [restaurant_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

// ดึงหมวดหมู่ตาม id
async function getCategoryById(id) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, restaurant_id, name FROM food_categories WHERE id=?",
      [id]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

// แก้ไขหมวดหมู่
async function updateCategory(id, name) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE food_categories SET name=? WHERE id=?",
      [name, id]
    );
  } finally {
    conn.release();
  }
}

// ลบหมวดหมู่
async function deleteCategory(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "DELETE FROM food_categories WHERE id=?",
      [id]
    );
  } finally {
    conn.release();
  }
}

module.exports = {
  createCategory,
  getCategoriesByRestaurant,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
