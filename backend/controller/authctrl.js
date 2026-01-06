const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../model/user_model');

exports.register = async (req, res) => {

    try {
        const { email, password, first_name, last_name, role } = req.body;

        // ตรวจข้อมูล
        if (!email || !password || !first_name || !last_name || !role) {
            return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
        }

        // role ที่อนุญาต
        const allowRoles = ['restaurant', 'customer', 'rider'];
        if (!allowRoles.includes(role)) {
            return res.status(400).json({ message: 'Role ไม่ถูกต้อง' });
        }

        // ตรวจ email ซ้ำ
        const exist = await User.checkemail(email);
        if (exist) {
            return res.status(400).json({ message: 'Email นี้ถูกใช้แล้ว' });
        }

        // hash password
        const hash = await bcrypt.hash(password, 10);

        // กำหนด status ตาม role
        let status = 'pending';
        if (role === 'customer') status = 'approved';

        const userId = await User.createuser({
            email,
            password: hash,
            first_name,
            last_name,
            role,
            status
        });

        return res.status(201).json({
            message:
                role === 'customer'
                    ? 'สมัครสมาชิกสำเร็จ'
                    : 'สมัครสำเร็จ รอผู้ดูแลระบบอนุมัติ',
            data: {
                id: userId,
                email,
                first_name,
                last_name,
                role,
                status
            }
        });
    } catch (err) {
        console.error('REGISTER ERROR:', err);
        res.status(500).json({ message: 'สมัครสมาชิกไม่สำเร็จ' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'กรอก email และ password' });
        }

        const user = await User.checkemail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });
        }

        // เช็คสถานะ
        if (user.status === 'pending') {
            return res.status(403).json({
                message: 'บัญชียังไม่ผ่านการอนุมัติจากผู้ดูแลระบบ'
            });
        }

        if (user.status === 'banned') {
            return res.status(403).json({
                message: 'บัญชีถูกระงับการใช้งาน'
            });
        }

        // ตรวจรหัสผ่าน
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: 'Email หรือ Password ไม่ถูกต้อง' });
        }

        // สร้าง token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                avatar: user.avatar,
                status: user.status
            }
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ message: 'เข้าสู่ระบบไม่สำเร็จ' });
    }
};
