const bcrypt = require('bcrypt');
const User = require('../model/user_model');
const Order = require('../model/order_model');


exports.getProfile = async (req, res) => {
    try {
        const user = await User.checkid(req.user.id);

        if (!user || user.role !== 'rider') {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ส่งอาหาร' });
        }

        res.json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar: user.avatar,
            status: user.status,
            created_at: user.created_at
        });

    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลได้' });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { email, first_name, last_name } = req.body;

        if (!email || !first_name || !last_name) {
            return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
        }

        await User.updateuser(req.user.id, email, first_name, last_name);

        res.json({ message: 'แก้ไขข้อมูลสำเร็จ' });

    } catch (err) {
        res.status(500).json({ message: 'แก้ไขข้อมูลไม่สำเร็จ' });
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ' });
        }

        const user = await User.checkid(req.user.id);
        const ok = await bcrypt.compare(old_password, user.password);

        if (!ok) {
            return res.status(400).json({ message: 'รหัสผ่านเดิมไม่ถูกต้อง' });
        }

        const hash = await bcrypt.hash(new_password, 10);
        await User.updatepassword(req.user.id, hash);

        res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });

    } catch (err) {
        res.status(500).json({ message: 'เปลี่ยนรหัสผ่านไม่สำเร็จ' });
    }
};


exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'ไม่พบไฟล์' });
        }

        const avatarPath = `/image/${req.file.filename}`;
        await User.updateAvatar(req.user.id, avatarPath);

        res.json({
            message: 'อัปโหลดรูปสำเร็จ',
            avatar: avatarPath
        });

    } catch (err) {
        res.status(500).json({ message: 'อัปโหลดไม่สำเร็จ' });
    }
};

exports.availableOrders = async (req, res) => {
    try {
        const orders = await Order.getAvailableOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงออเดอร์ได้' });
    }
};


exports.acceptOrder = async (req, res) => {
    try {
        const { id } = req.params; // order_id

        await Order.assignRider(id, req.user.id);

        res.json({ message: 'รับออเดอร์เรียบร้อย' });

    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถรับออเดอร์ได้' });
    }
};


exports.orderDetail = async (req, res) => {
    try {
        const order = await Order.getOrderDetailForRider(
            req.params.id,
            req.user.id
        );

        if (!order) {
            return res.status(404).json({ message: 'ไม่พบออเดอร์' });
        }

        res.json(order);

    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลได้' });
    }
};


exports.completeOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await Order.completeOrder(id, req.user.id);

        res.json({ message: 'ยืนยันการส่งอาหารสำเร็จ' });

    } catch (err) {
        res.status(500).json({ message: 'ยืนยันการส่งไม่สำเร็จ' });
    }
};
