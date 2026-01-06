const { pool } = require("./conn");

async function getRestaurantById(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT r.*, u.email, u.first_name, u.last_name
       FROM restaurants r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [id]
    );

    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
}

async function getRestaurantByUser(user_id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT * FROM restaurants WHERE user_id = ?",
      [user_id]
    );

    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
}

async function listRestaurants() {
  const conn = await pool.getConnection();
  try {
    return await conn.query(
      `SELECT r.id, r.restaurant_name, r.category,
              r.address, r.approved, r.created_at,
              u.email, u.first_name, u.last_name
       FROM restaurants r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
  } finally {
    conn.release();
  }
}

async function approveRestaurant(id, approved) {
  const conn = await pool.getConnection();
  try {
    await conn.query("UPDATE restaurants SET approved=? WHERE id=?", [
      approved,
      id,
    ]);
  } finally {
    conn.release();
  }
}

async function updateRestaurant(id, restaurant_name, category, address) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE restaurants
       SET restaurant_name=?, category=?, address=?
       WHERE id=?`,
      [restaurant_name, category, address, id]
    );
  } finally {
    conn.release();
  }
}

async function deleteRestaurant(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM restaurants WHERE id=?", [id]);
  } finally {
    conn.release();
  }
}

module.exports = {
  getRestaurantById,
  getRestaurantByUser,
  listRestaurants,
  approveRestaurant,
  updateRestaurant,
  deleteRestaurant
};
