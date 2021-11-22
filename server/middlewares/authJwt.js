const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

class AuthJwt {
    verifyToken = (req, res, next) => {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send({ success: false, message: "No token provided!" });
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            req.userId = decoded.userId;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).send({ success: false, message: "Invalid token!" });
        }
    };

    async isAdmin(req, res, next) {
        try {
            const hasUser = await User.findById(req.userId);
            const hasRole = await Role.findOne(hasUser.role);

            if (hasRole.name === "admin") return next();

            res.status(403).send({ success: false, message: "Require admin role!" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Internal server error" });
        }
    }
}

module.exports = new AuthJwt();