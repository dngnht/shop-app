const Product = require("../models/Product");

class ProductController {
  async show(req, res) {
    try {
      const hasProducts = await Product.find({}).populate("user", "name -_id");
      res.json({ success: true, hasProducts });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "サーバーにはエラーが発生しまた"
      });
    }
  }
}
module.exports = new ProductController();
