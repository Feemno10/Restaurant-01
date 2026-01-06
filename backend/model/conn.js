const pool = require('../config/db');

async function withTx(callback) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const result = await callback(conn);

        await conn.commit();
        return result;
    } catch (err) {
        if (conn) await conn.rollback();
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { withTx, pool };
