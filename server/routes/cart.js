const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

router.post("/cart", cartController.showCart);

module.exports = router;
