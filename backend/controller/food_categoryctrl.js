const FoodCategory = require("../model/food_category_model");


exports.createCategory = async (req, res) => {
  try {
    const restaurant_id = req.user.id; // สำหรับ restaurant
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "กรอกชื่อหมวดหมู่" });
    }

    const id = await FoodCategory.createCategory(restaurant_id, name);

    res.status(201).json({
      message: "สร้างหมวดหมู่สำเร็จ",
      category_id: id,
    });
  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({ message: "สร้างหมวดหมู่ไม่สำเร็จ" });
  }
};


exports.getCategories = async (req, res) => {
  try {
    const restaurant_id = req.user.id; // สำหรับ restaurant
    const categories = await FoodCategory.getCategoriesByRestaurant(restaurant_id);
    res.json(categories);
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    res.status(500).json({ message: "ไม่สามารถดึงหมวดหมู่ได้" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "กรอกชื่อหมวดหมู่ใหม่" });
    }

    await FoodCategory.updateCategory(id, name);
    res.json({ message: "แก้ไขหมวดหมู่สำเร็จ" });
  } catch (err) {
    console.error("UPDATE CATEGORY ERROR:", err);
    res.status(500).json({ message: "แก้ไขหมวดหมู่ไม่สำเร็จ" });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await FoodCategory.deleteCategory(id);
    res.json({ message: "ลบหมวดหมู่สำเร็จ" });
  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);
    res.status(500).json({ message: "ลบหมวดหมู่ไม่สำเร็จ" });
  }
};
