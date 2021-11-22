require("dotenv").config();
const User = require("../models/User");
const Role = require("../models/Role");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class Authentication {
    async getUser(req, res) {
            try {
                const hasUser = await User.findById(req.userId)
                    .select("-password")
                    .populate("role", "-__v -_id -create_at")
                    .populate("cart");
                if (!hasUser) {
                    return res.status(400).json({ success: false, message: "ユーザーが存在してないです!" });
                }
                return res.json({ success: true, hasUser });
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "サーバーにはエラーが発生しまた" });
            }
        }
        // [POST]/api/auth/signup
    async signup(req, res) {
        const { name, password, email, role } = req.body;

        try {
            //Check duplicate email
            const hasEmail = await User.findOne({ email });
            if (hasEmail) {
                return res
                    .status(400)
                    .json({ success: false, message: "このメールアドレスは既に使用されています!" });
            }
            //Create a new user
            const hashedPassword = await bcrypt.hashSync(password, 10);

            const newUser = new User({ name, password: hashedPassword, email });

            //set role for user
            if (role) {
                const hasRole = await Role.findOne({ name: role });

                //check role exists
                if (!hasRole) {
                    return res
                        .status(400)
                        .json({ success: false, message: `失敗, ロール ${role} は存在してありません！` });
                }
                newUser.role = hasRole._id;
            } else {
                const hasRole = await Role.findOne({ name: "user" });
                newUser.role = hasRole._id;
            }
            const newCart = new Cart({ user: newUser._id });
            await newCart.save();
            newUser.cart = newCart;
            await newUser.save();
            res.json({ success: true, message: "ユーザー登録完了" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しまた" });
        }
    }

    // [POST]/api/auth/signup
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(401)
                .json({ success: false, message: "メーリングリスト又はパスワードが空いています！" });
        }

        try {
            //Check duplicate email
            const hasUser = await User.findOne({ email }).populate("role");
            if (!hasUser) {
                return res
                    .status(400)
                    .json({ success: false, message: "このメールアドレスは使用されていません!" });
            }

            //Check password
            const passwordIsValid = await bcrypt.compareSync(password, hasUser.password);
            if (!passwordIsValid) {
                return res
                    .status(400)
                    .json({ success: false, message: "メールアドレス又はパスワードが`間違われています!" });
            }

            //Token
            const accessToken = await jwt.sign({ userId: hasUser._id }, process.env.ACCESS_TOKEN_SECRET);

            // Return user info
            res.status(200).json({
                success: true,
                message: "ログインできました。",
                name: hasUser.name,
                email: hasUser.email,
                role: hasUser.role.name,
                accessToken
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "サーバーにはエラーが発生しまた" });
        }
    }
}
module.exports = new Authentication();