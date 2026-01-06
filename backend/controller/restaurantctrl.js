const Restaurant = require("../model/restaurant_model");

exports.updateRestaurant = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { restaurant_name, category, address } = req.body;

    const restaurant = await Restaurant.getRestaurantByUser(user_id);
    if (!restaurant) {
      return res.status(404).json({ message: "ไม่พบร้านอาหาร" });
    }

    if (!restaurant.approved) {
      return res.status(403).json({ message: "ร้านยังไม่ได้รับการอนุมัติ" });
    }

    await Restaurant.updateRestaurant(
      restaurant.id,
      restaurant_name,
      category,
      address
    );

    res.json({ message: "แก้ไขข้อมูลร้านสำเร็จ" });

  } catch (err) {
    console.error("UPDATE RESTAURANT ERROR:", err);
    res.status(500).json({ message: "แก้ไขข้อมูลร้านไม่สำเร็จ" });
  }
};


exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.getRestaurantByUser(req.user.id);

    if (!restaurant) {
      return res.status(404).json({ message: "คุณยังไม่มีร้านอาหาร" });
    }

    res.json(restaurant);

  } catch (err) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลร้านได้" });
  }
};


exports.approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body; // true / false

    await Restaurant.approveRestaurant(id, approved);

    res.json({
      message: approved
        ? "อนุมัติร้านอาหารเรียบร้อย"
        : "ยกเลิกการใช้งานร้านอาหารเรียบร้อย"
    });

  } catch (err) {
    console.error("APPROVE RESTAURANT ERROR:", err);
    res.status(500).json({ message: "ดำเนินการไม่สำเร็จ" });
  }
};


exports.listRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.listRestaurants();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลร้านได้" });
  }
};
