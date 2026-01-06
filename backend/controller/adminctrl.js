const bcrypt = require('bcrypt');
const User = require('../model/user_model')

exports.updateProfile = async (req,res)=>{
    try{
        const { email , first_name , last_name} = req.body;
        const id = req.user.id;

        await User.updateuser(id , email , first_name , last_name)

        res.json({ success : true , message : "แก้ไขข้อมูลสำเร็จ"});
    }catch(err){
        res.status(500).json ({ message : "แก้ไขข้อมูลไม่สำเร็จ"});
    }
};

exports.changePassword = async (req,res)=>{
    try{
    const { password } = req.body;
    const id = req.user.id;

    const hash = await bcrypt.hash(password , 10);
    await User.updatepassword(id , hash)

    res.json ({ success : true , message : "เปลี่ยนรหัสผ่านสำเร็จ"})
    }catch(err){
        res.status(500).json ({ message : "เปลี่ยนรหัสผ่าไม่สำเร็จ"});
    }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    if (!["restaurant", "rider"].includes(role)) {
      return res.status(400).json({ message: "role ไม่ถูกต้อง" });
    }

    const exist = await User.checkemail(email);
    if (exist) {
      return res.status(400).json({ message: "Email ถูกใช้แล้ว" });
    }

    const hash = await bcrypt.hash(password, 10);

    const userId = await User.createuser(
      email,
      hash,
      first_name,
      last_name,
      role
    );

    res.status(201).json({
      success: true,
      message: "สร้างผู้ใช้งานสำเร็จ",
      user_id: userId
    });
  } catch (err) {
    res.status(500).json({ message: "สร้างผู้ใช้งานไม่สำเร็จ" });
  }
};

exports.approveUser = async (req,res)=>{
    try{
        const { id } = req.params;
        await User.updateStatus(id , 'approved');
        
        res.json ({ success : true , message : "อนุมัติผู้ใช้งานแล้ว"});
    }catch(err){
        res.status(500).json ({ message : "อนุมัติผู้ใช้งานไม่สำเร็จ"});
    }
};

exports.banUser = async (req,res)=>{
    try{
    const { id } = req.params;
    await User.updateStatus (id , 'banned');

    res.json ({ success : true , message : "ระงับผู้ใช้งานแล้ว"})
    }catch(err){
        res.status(500).json ({ message : "ระงับผู้ใช้งานไม่สำเร็จ"});
    }
};

exports.listAllUser = async (req,res)=>{
    try{
        const users = await User.listUsers();
        res,json ({ success : true , data : users});
    }catch(err){
        res.status(500).json ({ message : "โหลดข้อมูลไม่สำเร็จ"});
    }
};

exports.listRestaurants = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.status, r.restaurant_name
       FROM users u
       JOIN restaurants r ON u.id = r.user_id
       WHERE u.role='restaurant'`
    );
    conn.release();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลร้านอาหารไม่สำเร็จ" });
  }
};

exports.listRiders = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT id, email, first_name, last_name, status
       FROM users
       WHERE role='rider'`
    );
    conn.release();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูล rider ไม่สำเร็จ" });
  }
};