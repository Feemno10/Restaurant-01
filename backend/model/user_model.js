const { pool } = require("./conn");

async function checkemail(email) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
};

async function checkid(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
};

async function createuser(data) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO users 
      (email, password, first_name, last_name, role, avatar, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.email,
        data.password,
        data.first_name,
        data.last_name,
        data.role || "customer",
        data.avatar || "/uploads/default-avatar.png",
        data.status || (data.role === "customer" ? "approved" : "pending"),
      ]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

async function updateuser(id, email, first_name, last_name) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE users SET email=?, first_name=?, last_name=? WHERE id=?",
      [email, first_name, last_name, id]
    );
  } finally {
    conn.release();
  }
}

async function updatepassword(id, password) {
  const conn = await pool.getConnection();
  try {
    await conn.query("UPDATE users SET password=? WHERE id=?", [password, id]);
  } finally {
    conn.release();
  }
}

async function updateAvatar(id, avatar) {
  const conn = await pool.getConnection();
  try {
    await conn.query("UPDATE users SET avatar=? WHERE id=?", [avatar, id]);
  } finally {
    conn.release();
  }
}

async function updateRole(id, role) {
  const conn = await pool.getConnection();
  try {
    await conn.query("UPDATE users SET role=? WHERE id=?", [role, id]);
  } finally {
    conn.release();
  }
}

async function updateStatus(id, status) {
  const conn = await pool.getConnection();
  try {
    await conn.query("UPDATE users SET status=? WHERE id=?", [status, id]);
  } finally {
    conn.release();
  }
}

async function listUsers() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      `SELECT id, email, first_name, last_name, role, status, avatar, created_at
       FROM users
       ORDER BY id DESC`
    );
    return rows;
  } finally {
    conn.release();
  }
}

async function deleteuser(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM users WHERE id=?", [id]);
  } finally {
    conn.release();
  }
}

module.exports = {
  checkemail,checkid,createuser,updateuser, updatepassword,updateAvatar,updateRole,updateStatus,listUsers,deleteuser,
};
