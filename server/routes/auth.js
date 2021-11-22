const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJwt");
const authController = require("../controllers/AuthController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/", authJwt.verifyToken, authController.getUser);

module.exports = router;
