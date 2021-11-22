const Cart = require("../models/Cart");

class CartController {
    async showCart(req, res) {
        try {
            const { cartId } = req.body;
            const hasCarts = await Cart.findOne({ _id: cartId })
                .populate("items.product")
                .populate("user", "-password -__v -cart -created_at");
            const map = new Map();
            for (const item of hasCarts.items) {
                if (map.has(item.product._id)) {
                    let x = map.get(item.product._id);
                    x.quantity += 1;
                    map.set(item.product._id, x);
                } else {
                    map.set(item.product._id, item);
                }
            }
            const filteredCarts = [];
            map.forEach(x => {
                filteredCarts.push(x);
            });
            res.json({ success: true, filteredCarts });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "サーバーにはエラーが発生しまた"
            });
        }
    }
}
module.exports = new CartController();