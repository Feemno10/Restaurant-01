const Food = require("../model/food_model");
const upload = require("../middleware/upload");


exports.getFoodsByRestaurant = async (req, res) => {
    try {
        const restaurant_id = req.params.restaurant_id;
        const foods = await Food.getFoodsByRestaurant(restaurant_id);
        res.json({ success: true, data: foods });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "ไม่สามารถดึงข้อมูลอาหารได้" });
    }
};


exports.getFoodById = async (req, res) => {
    try {
        const id = req.params.id;
        const food = await Food.getFoodById(id);
        if (!food) return res.status(404).json({ success: false, message: "ไม่พบอาหาร" });
        res.json({ success: true, data: food });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "ไม่สามารถดึงข้อมูลอาหารได้" });
    }
};


exports.createFood = async (req, res) => {
    try {
        const { category_id, name, price, discount_percent } = req.body;
        let image = req.file ? `/image/${req.file.filename}` : null;

        if (!category_id || !name || !price) {
            return res.status(400).json({ success: false, message: "กรอกข้อมูลไม่ครบ" });
        }

        const id = await Food.createFood(category_id, name, price, image, discount_percent || 0);
        res.status(201).json({ success: true, message: "สร้างอาหารสำเร็จ", food_id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "สร้างอาหารไม่สำเร็จ" });
    }
};


exports.updateFood = async (req, res) => {
    try {
        const id = req.params.id;
        const { category_id, name, price, discount_percent } = req.body;
        let image = req.file ? `/image/${req.file.filename}` : null;

        const food = await Food.getFoodById(id);
        if (!food) return res.status(404).json({ success: false, message: "ไม่พบอาหาร" });

        await Food.updateFood(id, category_id, name, price, image, discount_percent || 0);
        res.json({ success: true, message: "แก้ไขอาหารสำเร็จ" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "แก้ไขอาหารไม่สำเร็จ" });
    }
};


exports.deleteFood = async (req, res) => {
    try {
        const id = req.params.id;
        const food = await Food.getFoodById(id);
        if (!food) return res.status(404).json({ success: false, message: "ไม่พบอาหาร" });

        await Food.deleteFood(id);
        res.json({ success: true, message: "ลบอาหารสำเร็จ" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "ลบอาหารไม่สำเร็จ" });
    }
};
