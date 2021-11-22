const Cart = require("../models/Cart");
const Credit = require("../models/Credit");
const Payment = require("../models/Payment");
const User = require("../models/User");
class UserController {
    async addToCart(req, res) {
        try {
            const { cartId, productId } = req.body;
            const hasCart = await Cart.findOne({ _id: cartId });
            if (!hasCart) {
                return res.json({
                    success: false,
                    message: "Not found this cart "
                });
            }
            const addToCart = await Cart.findOneAndUpdate({ _id: cartId }, {
                $push: {
                    items: {
                        product: productId
                    }
                }
            });

            return res.json({
                success: true,
                message: "Add " + cartItemId + " to cart Successfully",
                addToCart
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    async delFromCart(req, res) {
        try {
            const { cartId, productId } = req.body;
            const delFromCart = await Cart.findOneAndUpdate({ _id: cartId }, {
                    $pull: {
                        items: {
                            product: productId
                        }
                    }
                },
                false
            );
            if (!delFromCart) {
                return res.json({
                    success: false,
                    message: "Can't not delete this product in this Cart "
                });
            }
            return res.json({
                success: true,
                message: "Delete " + cartItemId + " from " + cartId + " Successfully"
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    async clearCart(req, res) {
        const { cartId } = req.body;
        try {
            //delete old cart
            const clearCart = await Cart.findOneAndDelete({ _id: cartId });

            //create new cart for user
            const hasUser = await User.findOne({ _id: req.userId });
            const newCart = await Cart.create({ user: hasUser._id });
            hasUser.cart = newCart._id;
            hasUser.save();
            return res.json({
                success: true,
                message: "Clear cart successfully",
                cart: newCart
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    async checkCredit(req, res) {
        try {
            //check is existed Credit
            const hasCredit = await Credit.find({}).populate("credit", "-cvCode");
            const isHaveCredit = hasCredit.find(credit => credit.user == req.userId);
            if (isHaveCredit) {
                return res.json({
                    success: true,
                    message: "You have been registered Payment method",
                    credit: isHaveCredit
                });
            } else {
                return res.json({
                    success: true,
                    message: "You haven't registered payment method yet",
                    credit: null
                });
            }
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    async addCredit(req, res) {
        try {
            const { cardNumber, cvCode, expiry } = req.body;
            const newCredit = { user: req.userId, cardNumber, cvCode, expiry };
            const response = await Credit.create(newCredit);
            return res.json({
                success: true,
                message: "You have been registered Credit successfully"
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    async addPayment(req, res) {
        try {
            const { items, price, creditNumber } = req.body;
            const { date, time, address } = req.body.userForm;
            const payment = { user: req.userId, date, time, items, address, price, creditNumber };
            const addPayment = await Payment.create(payment);

            return res.json({
                success: true,
                message: "You have bought this product"
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
    async showPayment(req, res) {
        try {
            const Receipt = await Receipt.find({});
            const hasReceipt = Receipt.find(item => {
                item.user == req.userId;
            });
            return res.json({
                success: true,
                message: "You have these receipt",
                receipt: hasReceipt
            });
        } catch (error) {
            return res.json({
                success: false,
                message: error.message
            });
        }
    }
}
module.exports = new UserController();