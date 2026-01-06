const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // ตรวจ header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'ไม่มีสิทธิเข้าถึง' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
    }
};

exports.role = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};
