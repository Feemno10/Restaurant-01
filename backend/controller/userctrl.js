const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const User = require("../model/user_model");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.checkid(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    delete user.password;
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "โหลดข้อมูลไม่สำเร็จ" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { email, first_name, last_name } = req.body;
    const userId = req.user.id;

    const exist = await User.checkemail(email);
    if (exist && exist.id !== userId) {
      return res.status(400).json({ message: "Email นี้ถูกใช้แล้ว" });
    }

    await User.updateuser(userId, email, first_name, last_name);

    res.json({ success: true, message: "แก้ไขข้อมูลสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "แก้ไขข้อมูลไม่สำเร็จ" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.checkid(req.user.id);

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "รหัสผ่านเดิมไม่ถูกต้อง" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await User.updatepassword(user.id, hash);

    res.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เปลี่ยนรหัสผ่านไม่สำเร็จ" });
  }
};


exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "กรุณาเลือกรูปภาพ" });
    }

    const user = await User.checkid(req.user.id);

    if (user.avatar && !user.avatar.includes("default-avatar")) {
      const oldFile = user.avatar.split("/public/image/")[1];
      const oldPath = path.join(__dirname, "../public/image/", oldFile);

      fs.unlink(oldPath, err => {
        if (err) console.log("ลบรูปเก่าไม่สำเร็จ:", err.message);
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/public/image/${req.file.filename}`;

    await User.updateAvatar(req.user.id, imageUrl);

    res.json({
      success: true,
      message: "อัปเดตรูปโปรไฟล์สำเร็จ",
      avatar: imageUrl
    });
  } catch (err) {
    res.status(500).json({ message: "อัปโหลดรูปไม่สำเร็จ" });
  }
};