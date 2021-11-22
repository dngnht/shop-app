const Product = require("../models/Product");

class TrashController {
    async show(req, res) {
        try {
            const hasTrash = await Product.findDeleted({}).populate("user", "name -_id");
            res.json({ success: true, hasTrash });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しました" });
        }
    }
}

module.exports = new TrashController();