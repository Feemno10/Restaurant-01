const Order = require('../model/order_model');

/**
 * =========================
 * CUSTOMER
 * =========================
 */

// สร้างออเดอร์
exports.createOrder = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { restaurant_id, total_price } = req.body;

        if (!restaurant_id || !total_price) {
            return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
        }

        const orderId = await Order.createOrder(
            user_id,
            restaurant_id,
            total_price
        );

        res.status(201).json({
            message: 'สร้างออเดอร์สำเร็จ',
            order_id: orderId
        });

    } catch (err) {
        console.error('CREATE ORDER ERROR:', err);
        res.status(500).json({ message: 'สร้างออเดอร์ไม่สำเร็จ' });
    }
};

// ดูประวัติออเดอร์ของตัวเอง
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.getOrdersByUser(req.user.id);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลออเดอร์ได้' });
    }
};

/**
 * =========================
 * RESTAURANT
 * =========================
 */

// ดูออเดอร์ของร้าน
exports.restaurantOrders = async (req, res) => {
    try {
        const { restaurant_id } = req.params;
        const orders = await Order.getOrdersByRestaurant(restaurant_id);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงออเดอร์ร้านได้' });
    }
};

// เปลี่ยนสถานะ (preparing / completed)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await Order.updateOrderStatus(id, status);

        res.json({ message: 'อัปเดตสถานะสำเร็จ' });
    } catch (err) {
        res.status(500).json({ message: 'อัปเดตสถานะไม่สำเร็จ' });
    }
};

/**
 * =========================
 * RIDER
 * =========================
 */

// ดูออเดอร์ที่ยังไม่มีคนรับ
exports.availableOrders = async (req, res) => {
    try {
        const orders = await Order.getAvailableOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงออเดอร์ได้' });
    }
};

// Rider รับงาน
exports.takeOrder = async (req, res) => {
    try {
        const rider_id = req.user.id;
        const { id } = req.params;

        await Order.assignRider(id, rider_id);

        res.json({ message: 'รับงานเรียบร้อย' });
    } catch (err) {
        res.status(500).json({ message: 'รับงานไม่สำเร็จ' });
    }
};

/**
 * =========================
 * ADMIN
 * =========================
 */

exports.listAllOrders = async (req, res) => {
    try {
        const orders = await Order.listAllOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลได้' });
    }
};
